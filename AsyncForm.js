import Inputmask from 'inputmask';
import AlertMessage from './AlertMessage.js';
import LoadingOverlay from './LoadingOverlay.js';

class AsyncForm
{
    constructor(formId, options = {}) // happens once
    {
        this.processingTransaction = false;
        this.loadingOverlay = document.querySelector('loading-overlay'); // LoadingOverlay
        this.alertMessage = document.querySelector('alert-message'); // AlertMessage
        this.form = document.querySelector('#' + formId);

        Inputmask().mask(this.form.querySelectorAll("input"));

        this.options = {
            csrfToken:null,
            bearerToken:null,
            validationErrorsDisplayType:"per-element", // "grouped|per-element"
            onResponse:"flash-{3000}", // "flash-{ms}|flash-redirect-{ms}|redirect|confirm|confirm-redirect"
            redirectUrl:null, // "/some/url/route/{response_var_name}/{response_var_name_2}/...."
            successMessage:"Success!",
            processingMessage:"Processing...",
            unnamedElementValidationCallback:null, // (key, responseJson.errors)
            ...options
        };

        this.setupForm();
    }

    getValueInBrackets(str)
    {
        let match = str.match(/{([^}]+)}/);

        if (match)
            return match[1]; // Return only the capture group

        return null;
    }

    replaceVarsInUrl(url, obj)
    {
        return url.replace(/{([^}]+)}/g, function(match, captureGroup) {
            return obj[captureGroup];
        });
    }

    setupForm()
    {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();

            if(this.processingTransaction)
                return;

            this.processingTransaction = true;

            if(this.options.processingMessage === null)
                this.loadingOverlay.show();
            else
                this.loadingOverlay.show(this.options.processingMessage);

            let fd = new FormData(this.form);
            let fdp = new FormData();

            for (let fde of fd.entries())
            {
                let el = this.form.elements[fde[0]];
                if(el.inputmask && el.getAttribute('data-clearmaskonsubmit') === 'true')
                    fdp.append(fde[0], el.inputmask.unmaskedvalue());
                else
                    fdp.append(fde[0], fde[1]);
            }

            this.sendFormData(fdp);

        });
    }

    resetValidationMessages()
    {
        if(this.options.validationErrorsDisplayType === 'grouped')
        {
            let groupedValidationDiv = document.getElementById('groupedValidationDiv');
            if(groupedValidationDiv)
                groupedValidationDiv.remove();

            return;
        }

        this.form.querySelectorAll('.invalid-feedback').forEach(e => e.parentNode.removeChild(e));

        // get all input elements within form
        let inputElements = this.form.querySelectorAll("input, textarea, select");

        // convert the NodeList to an array, extract the "name" property of each element,
        // and filter out duplicate names
        this.namedElements = Array.from(inputElements)
            .map((element) => element.name)
            .filter((name, index, array) => array.indexOf(name) === index);

        // remove 'is-invalid' class from all elements
        inputElements.forEach(e => e.classList.remove('is-invalid'));
    }

    async sendFormData(formData) {
        try
        {
            // Set request data
            let fetchOptions = {
                method: this.form.method,
                headers: {
                    'Accept': 'application/json'// accepting this
                },
                body: formData
            };

            // Add conditional headers
            /*
                If you are using this element within a webapp, then you're probably authenticating users via session ids
                saved within a cookie, in which case you need to include a csrf token to mitigate potential csrf attacks
                since cookies are sent with every request.

                If you are using this element within an spa, you need to include an access token in the http
                Authorization header

                // change csrfToken to be included as hidden value in form data vs in header, removed all together
                // because you can just add it to the form elements in the markup
             */
            if (this.options.bearerToken !== null)
                fetchOptions.headers['Authorization'] = 'Bearer ' + this.options.bearerToken;

            // Send request
            let response = await fetch(this.form.action, fetchOptions);

            // Check request
            if (response.ok) // valid response, 200
            {
                this.resetValidationMessages();

                let responseJson = await response.json();

                this.loadingOverlay.hide();

                if(this.options.onResponse.includes('flash-redirect'))
                {
                    this.alertMessage.show(this.options.successMessage, 'success');

                    let time = parseInt(this.getValueInBrackets(this.options.onResponse));

                    setTimeout(() => {

                        if(this.options.redirectUrl === null)
                            window.location.reload();

                        window.location.href = this.replaceVarsInUrl(this.options.redirectUrl, responseJson);

                    }, time);
                }
                else if(this.options.onResponse.includes('flash'))
                {
                    this.alertMessage.show(this.options.successMessage, 'success', parseInt(this.getValueInBrackets(this.options.onResponse)));
                    this.form.reset();
                }
                else if(this.options.onResponse.includes('confirm-redirect'))
                {
                    this.alertMessage.show(this.options.successMessage, 'success', () => {
                        if(this.options.redirectUrl === null)
                            window.location.reload();

                        window.location.href = this.replaceVarsInUrl(this.options.redirectUrl, responseJson);
                    });
                }
                else if(this.options.onResponse.includes('confirm'))
                {
                    this.alertMessage.show(this.options.successMessage, 'success', () => {
                        this.form.reset();
                    });
                }
                else if(this.options.onResponse.includes('redirect'))
                {
                    if(this.options.redirectUrl === null)
                        window.location.reload();

                    window.location.href = this.replaceVarsInUrl(this.options.redirectUrl, responseJson);
                }
            }
            else // http error, something other than 2xx
            {
                this.processingTransaction = false;
                this.loadingOverlay.hide();

                let responseJson = await response.json();

                if(response.status !== 422 || (response.status === 422 && !responseJson.hasOwnProperty('errors')))
                {
                    this.alertMessage.show('An unexpected error has occurred while processing your request', 'danger', () => {});
                    return;
                }

                // if we made it here, then we know we have received a response with code 422 and that the required
                // 'errors' property is present within the responseJson object.


                // clear previous errors
                this.resetValidationMessages();

                // if we are to display errors in one big alert container, do that and return, otherwise continue
                // onward to displaying error messages underneath each input element and adding required classes to
                // individual form components
                if(this.options.validationErrorsDisplayType === "grouped")
                {
                    let groupedValidationDiv = document.createElement('div');
                    groupedValidationDiv.id = 'groupedValidationDiv';
                    groupedValidationDiv.classList.add('alert');
                    groupedValidationDiv.classList.add('alert-danger');
                    groupedValidationDiv.innerHTML = (() => {

                        let errorList = '<ul>';
                        Object.keys(responseJson.errors).forEach((key) => {
                            errorList += `<li>${responseJson.errors[key][0]}</li>`;
                        });
                        errorList += '</ul>';

                        return errorList;
                    })();

                    this.form.parentNode.insertBefore(groupedValidationDiv, this.form);

                    return;
                }

                // must figure out how to handle elements of arrays, going to go hack around in the
                // form-array-element-example...
                //
                // ok, so when submitting form inputs that are array's their names follow the below format
                // [
                //     "keyValPair[0][key]",
                //     "keyValPair[0][value]"
                // ]
                // I have tweaked the request validator to output using this format instead of the .* format so the
                // names that are returned can be used just like names that are not arrays and then referenced correctly
                // in the below code to auto set error styles/messages...woot

                // add invalid classes to all elements which require them
                Object.keys(responseJson.errors).forEach((key) => {

                    if(this.namedElements.includes(key))
                    {
                        let element = this.form.querySelector('input[name="' + key + '"]') ||
                            this.form.querySelector('select[name="' + key + '"]') ||
                            this.form.querySelector('textarea[name="' + key + '"]');

                        element.classList.add('is-invalid');

                        element.insertAdjacentHTML('afterend','<span class="invalid-feedback" role="alert"><strong>' +
                            responseJson.errors[key][0] + '</strong></span>');
                    }

                    // if set, run unnamedElementValidationCallback
                    if(this.options.unnamedElementValidationCallback !== null)
                        this.options.unnamedElementValidationCallback(key, responseJson.errors);
                });

            }
        }
        catch (error) // bad error
        {
            this.processingTransaction = false;
            this.loadingOverlay.hide();

            console.error('Fetch error', error);
            this.alertMessage.show('An unexpected error has occurred while processing your request', 'danger', () => {});
        }
    }

}

export default AsyncForm;