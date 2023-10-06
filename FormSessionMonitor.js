import AlertMessage from './AlertMessage.js';
import LoadingOverlay from './LoadingOverlay.js';

class FormSessionMonitor
{
    constructor()
    {
        this.loadingOverlay = document.querySelector('loading-overlay'); // LoadingOverlay
        this.alertMessage = document.querySelector('alert-message'); // AlertMessage

        this.hasSession = null;
        this.isAuthenticated = null;
        this.hasRid = null;
        this.sessionExpirationTime = null;
        this.csrfUpdateAttempted = false;

        this.getSessionMetaData();

    }

    async getSessionMetaData()
    {
        try
        {
            // Replace 'YOUR_ENDPOINT_URL' with the URL you want to fetch data from
            const response = await fetch('/session-meta-data', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            // Assuming the response has the fields 'field1' and 'field2' that you want
            this.hasSession = data.hasSession;
            this.isAuthenticated = data.isAuthenticated;
            this.hasRid = data.hasRid;
            this.sessionExpirationTime = data.sessionExpirationTime;

            if(this.isAuthenticated && !this.hasRid)
                this.monitorSessionTimeout();
        }
        catch (error)
        {
            console.error("There was a problem fetching the session details:", error);
        }
    }

    monitorSessionTimeout()
    {

        let formSessionMonitorInstance = this;
        setInterval(() => {

            let expiryTimeInMs = this.sessionExpirationTime * 1000;

            const currentTimeInMs = Date.now();
            const fiveMinutesInMs = 5 * 60 * 1000;
            //const fiveMinutesInMs = 19 * 60 * 1000;

            if ((expiryTimeInMs - currentTimeInMs) <= fiveMinutesInMs) {
                this.alertMessage.show('Your session is about to expire. To continue without interruption please click the "Ok" button', 'warning', ()=>{
                    formSessionMonitorInstance.keepSessionAlive();
                });
            }

            if(expiryTimeInMs <= currentTimeInMs)
                location.href = '/auth/login';

        }, 60000);
    }

    keepSessionAlive()
    {
        fetch("/session-meta-data", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Network response was not ok");
            } else {
                return response.json();
            }
        })
        .then(data => {

            this.hasSession = data.hasSession;
            this.isAuthenticated = data.isAuthenticated;
            this.hasRid = data.hasRid;
            this.sessionExpirationTime = data.sessionExpirationTime;

        })
        .catch(error => {
            document.querySelector('alert-message').show('An unexpected error has occurred while processing your request', 'danger', () => {});
            console.error('There was a problem with the fetch operation:', error.message);
        });
    }

    updateCsrf(formElementName, formObj)
    {
        //alert(formElementName);

        if(this.csrfUpdateAttempted)
        {
            // should never need to make call to revalidate csrf more than once. If so, something bad has happened, so display an error message
            // and stop making api calls
            document.querySelector('alert-message').show('An unexpected error has occurred while processing your request22', 'danger', () => {});
        }
        else
        {
            fetch("/get-csrf", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            .then(response => {
                if(!response.ok){
                    throw new Error("Network response was not ok");
                } else {
                    return response.json();
                }
            })
            .then(data => {

                let csrfElement = document.querySelector('input[name="' + formElementName + '"]');
                csrfElement.value = data.csrf;
                this.csrfUpdateAttempted = true;

                let event = new Event("submit", {
                    'bubbles'    : true,
                    'cancelable' : true
                });

                formObj.dispatchEvent(event);

            })
            .catch(error => {
                document.querySelector('alert-message').show('An unexpected error has occurred while processing your request33', 'danger', () => {});
                console.error('There was a problem with the fetch operation:', error.message);
            });
        }



    }



}

export default FormSessionMonitor;