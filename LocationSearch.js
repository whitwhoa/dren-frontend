import AlertMessage from './AlertMessage.js';

class LocationSearch extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
                    <style>
                        #adContainer {
                            position: relative;
                            width: 100%;
                        }

                        #adInput {
                            width: 100%;
                            box-sizing: border-box;
                            border-radius:30px;
                            height:56px;
                            font-size:20px;
                            line-height:26px;
                            outline:0;
                            overflow:hidden;
                            padding:0px;
                            padding-left:22px;
                            text-overflow:ellipsis;
                        }

                        #adDropdown {
                            display: none;
                            position: absolute;
                            left:0;
                            right:0;
                            /*width:100%;*/
                            box-sizing: border-box;
                            z-index: 1;
                            background-color:#FDFDFD;
                            border-left:1px solid black;
                            border-right:1px solid black;
                            border-bottom:1px solid black;
                            border-bottom-left-radius:10px;
                            border-bottom-right-radius:10px;
                            margin-left:25px;
                            margin-right:25px;
                            overflow:hidden;
                        }

                        #adDropdown a {
                            color: black;
                            padding: 10px;
                            text-decoration: none;
                            display: flex;
                            align-items: center;
                        }

                        #adDropdown a:hover {
                            background-color: #ddd;
                        }

                        #submitButton {
                            position: absolute;
                            right: 5px; /* adjust based on your preference */
                            top: 50%;
                            transform: translateY(-50%);
                            width: 47px; /* width of the circle */
                            height: 47px; /* height of the circle - should be equal to width for a perfect circle */
                            border-radius: 50%; /* makes it round */
                            background-color:#2B2B2B;
                            cursor: pointer;
                            border: none; /* removes default borders */
                            outline: none; /* to prevent default focus styles */
                            display: flex; /* centers content both vertically and horizontally */
                            justify-content: center;
                            align-items: center;
                            color:white;
                        }

                        #submitButton:hover {
                            background-color: #3C3C3C; /* A slightly lighter shade for hover effect, adjust as needed */
                        }

                        .locationIcon {
                            width: 18px;
                            height: 18px;
                            margin-right: 10px; /* to give some space between icon and text */
                            background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQwMCA0MDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgogICAgPHBhdGggZD0iTTE5Ny44NDksMEMxMjIuMTMxLDAsNjAuNTMxLDYxLjYwOSw2MC41MzEsMTM3LjMyOWMwLDcyLjg4NywxMjQuNTkxLDI0My4xNzcsMTI5Ljg5NiwyNTAuMzg4bDQuOTUxLDYuNzM4IGMwLjU3OSwwLjc5MiwxLjUwMSwxLjI1NSwyLjQ3MSwxLjI1NWMwLjk4NSwwLDEuOTAxLTAuNDYzLDIuNDg2LTEuMjU1bDQuOTQ4LTYuNzM4YzUuMzA4LTcuMjExLDEyOS44OTYtMTc3LjUwMSwxMjkuODk2LTI1MC4zODggQzMzNS4xNzksNjEuNjA5LDI3My41NjksMCwxOTcuODQ5LDB6IE0xOTcuODQ5LDg4LjEzOGMyNy4xMywwLDQ5LjE5MSwyMi4wNjIsNDkuMTkxLDQ5LjE5MWMwLDI3LjExNS0yMi4wNjIsNDkuMTkxLTQ5LjE5MSw0OS4xOTEgYy0yNy4xMTQsMC00OS4xOTEtMjIuMDc2LTQ5LjE5MS00OS4xOTFDMTQ4LjY1OCwxMTAuMiwxNzAuNzM0LDg4LjEzOCwxOTcuODQ5LDg4LjEzOHoiPjwvcGF0aD4KPC9zdmc+');
                            background-size: contain;
                            background-repeat: no-repeat;
                            display: inline-block;
                            vertical-align: middle;
                        }

                    </style>
                    <div id="adContainer">
                        <input type="text" id="adInput">
                        <button id="submitButton">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 18C14.0899 18 17 15.0899 17 11.5C17 7.91015 14.0899 5 10.5 5C6.91015 5 4 7.91015 4 11.5C4 15.0899 6.91015 18 10.5 18Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M20 20L16 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <div id="adDropdown">

                        </div>
                    </div>
                `;

        this.adInput = this.shadowRoot.querySelector("#adInput");
        this.adInput.setAttribute('placeholder', this.getAttribute('placeholder'));
        this.adDropdown = this.shadowRoot.querySelector("#adDropdown");
        this.searchUrl = this.getAttribute('searchUrl');
        this.submitUrl = this.getAttribute('submitUrl');
        this.verifyInputUrl = this.getAttribute('verifyInputUrl');
        this.submitButton = this.shadowRoot.querySelector("#submitButton");
        this.submitOnSelection = this.getAttribute('submitOnSelection') === "true";
        this.currentHighlightIndex = -1; // -1 === no option highlighted
        this.alertMessage = document.querySelector('alert-message'); // AlertMessage
        this.onSubmitCallback = (inputString, wasValid) => {

            if(wasValid)
            {
                let url = new URL(this.submitUrl, window.location.origin);
                url.searchParams.append('q', inputString);

                window.location.href = url.toString();
            }
            else
            {
                this.alertMessage.show('Sorry, we couldn\'t find results for: ' + inputString, 'danger', () => {});
            }

        };

        this.responseExceptionHandler = (error) => {console.log(error.message)};

        this.adInput.addEventListener('input', (e) => {
            this.fetchResults(e.target.value);
        });

        this.adInput.addEventListener('focus', (e) => {
            this.fetchResults(e.target.value);
        });

        this.adInput.addEventListener('blur', (e) => {

            // push this to the end of the event queue so active element gets updated before it is executed
            setTimeout(()=>{
                if(document.activeElement.tagName !== 'LOCATION-SEARCH')
                    this.hideDropdown();
            }, 0);

        });

        this.adInput.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 38: // Up arrow
                    e.preventDefault(); // prevent default behavior (like moving cursor in input)
                    this.navigateDropdown(-1);
                    break;
                case 40: // Down arrow
                    e.preventDefault();
                    this.navigateDropdown(1);
                    break;
                case 13: // Enter
                    this.selectHighlighted();
                    break;
            }
        });

        // clear any highlighting that may be present from arrow key selection when mouse is moved into dropdown
        this.adDropdown.addEventListener('mouseover', () => {
            const options = this.adDropdown.querySelectorAll('a');
            if (this.currentHighlightIndex !== -1 && options[this.currentHighlightIndex])
                options[this.currentHighlightIndex].style.backgroundColor = "";
            this.currentHighlightIndex = -1;
        });


        this.submitButton.addEventListener('click', (e) => {

            this.doSubmission(this.adInput.value);

        });

    }

    doSubmission(inputValue)
    {
        let url = new URL(this.verifyInputUrl, window.location.origin);
        url.searchParams.append('q', inputValue);

        fetch(url.toString(), {
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

                let wasOk = false;
                if(data.status === 'ok')
                    wasOk = true;

                this.onSubmitCallback(inputValue, wasOk);

            })
            .catch(error => {
                this.alertMessage.show('An unexpected error has occurred while processing your request', 'danger', () => {});
                console.error('There was a problem with the fetch operation:', error.message);
            });
    }

    navigateDropdown(direction)
    {
        const options = this.adDropdown.querySelectorAll('a');
        if (options.length === 0) return;

        // Un-highlight the currently highlighted option if there's one
        if (this.currentHighlightIndex !== -1 && options[this.currentHighlightIndex])
            options[this.currentHighlightIndex].style.backgroundColor = "";

        // Adjust the currentHighlightIndex
        this.currentHighlightIndex += direction;
        if (this.currentHighlightIndex >= options.length)
            this.currentHighlightIndex = 0;
        else if (this.currentHighlightIndex < 0)
            this.currentHighlightIndex = options.length - 1;

        // Highlight the newly focused option
        options[this.currentHighlightIndex].style.backgroundColor = "#ddd";
    }

    selectHighlighted()
    {
        const options = this.adDropdown.querySelectorAll('a');

        if(this.currentHighlightIndex === -1 && this.adInput.value !== "")
            this.submitButton.click();

        if (this.currentHighlightIndex !== -1 && options[this.currentHighlightIndex]) {
            options[this.currentHighlightIndex].click();
        }
    }

    hideDropdown()
    {
        this.adDropdown.innerHTML = '';
        this.adDropdown.style.display = "none";
        this.currentHighlightIndex = -1;
    }

    fetchResults(inputValue)
    {
        if(inputValue.trim() === "")
        {
            this.hideDropdown();
            return;
        }

        let url = new URL(this.searchUrl, window.location.origin);
        url.searchParams.append('q', inputValue);

        fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(response => {
                if(!response.ok){
                    throw new Error("AutoCompleteDropdown(" + url.toString() + "): Network response was not ok");
                } else {
                    return response.json();
                }
            })
            .then(data => {
                //console.log(data);
                this.displayResults(data);
            })
            .catch(error => {
                this.responseExceptionHandler(error);
            });
    }

    displayResults(results)
    {
        if(results.length === 0)
        {
            this.hideDropdown();
            return;
        }

        this.currentHighlightIndex = -1;
        this.adDropdown.innerHTML = '';

        for(let result in results)
        {
            let link = document.createElement('a');
            link.href = '#';

            let icon = document.createElement('div');
            icon.classList.add('locationIcon');
            link.appendChild(icon);

            link.appendChild(document.createTextNode(results[result]));

            link.onclick = (e) => {
                e.preventDefault();
                this.adInput.value = results[result];
                this.hideDropdown();

                if(this.submitOnSelection)
                    this.doSubmission(this.adInput.value);
            };
            this.adDropdown.appendChild(link);
        }

        this.adDropdown.style.display = "block";
    }

}

export default LocationSearch;