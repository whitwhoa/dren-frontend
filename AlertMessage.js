class AlertMessage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: none;
                position: fixed;
                top: 0; right: 0;
                bottom: 0; left: 0;
                background: rgba(0,0,0,0.7);
                z-index:10000;
                align-items: center;
                justify-content: center;
            }
            .message-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                border-radius: 5px;
                font-weight: bold;
                text-align: center;
                width: 85%;
            }
            .success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #155724;
            }
            .warning {
                background-color: #fff3cd;
                color: #856404;
                border: 1px solid #856404;
            }
            .danger {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #721c24;
            }
            .info {
                background-color: #CFE2FF;
                color: #052C65;
                border: 1px solid #052C65;
            }
            .alert-message-success-icon,
            .alert-message-warning-icon,
            .alert-message-danger-icon,
            .alert-message-info-icon{
                width: 40px;
                margin-bottom: 10px;
            }
            .alert-message-success-icon {
                color: #155724;
            }
            .alert-message-warning-icon {
                color: #856404;
            }
            .alert-message-danger-icon {
                color: #721c24;
            }
            .alert-message-info-icon {
                color: #052C65;
            }
            #confirmButton, #cancelButton {
                margin-top: 10px;
                display: none;
                padding: 10px 30px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                color: white;
                /*min-width: 25%;*/
            }


            .success #confirmButton, .success #cancelButton {
                background-color: #155724;
            }

            .warning #confirmButton, .warning #cancelButton {
                background-color: #856404;
            }

            .danger #confirmButton, .danger #cancelButton {
                background-color: #721c24;
            }
            
            .info #confirmButton, .info  #cancelButton {
                background-color: #052C65;
            }      
            
            .button-container {
                display: flex;
                justify-content: center; /* This will center the buttons horizontally */
                gap: 10px; /* This creates space between your buttons */
            }      
            
            @media (min-width: 576px) { 
                /* sm */
                
            }
            @media (min-width: 768px) { 
                /* md */
                .message-box {
                    width: 50%;
                }
                
            }
            @media (min-width: 992px) { 
                /* lg */
                .message-box {
                    width: 40%;
                }
                
            }
            @media (min-width: 1200px) { 
                /* xl */
                .message-box {
                    width: 35%;
                }
                
            }
            @media (min-width: 1400px) { 
                /* xxl */
                .message-box {
                    width: 28%;
                }
            }
            
        </style>
        <div class="message-box" id="messageBox">
            <svg id="icon" fill="currentColor" viewBox="0 0 16 16">
                <path class="outerPath"/>
                <path class="innerPath"/>
            </svg>
            <div id="messageText"></div>
            <div class="button-container">
                <button id="confirmButton">Ok</button>
                <button id="cancelButton">Cancel</button>
            </div>
        </div>
        `;

        this.confirmButton = this.shadowRoot.querySelector('#confirmButton');
        this.confirmButton.addEventListener('click', () => {
            if (this.callbackFunction)
            {
                this.callbackFunction();
                this.hide();
            }
        });

        this.cancelButton = this.shadowRoot.querySelector('#cancelButton');
        this.cancelButton.addEventListener('click', () => {
            this.hide();
        });
    }

    show(message, messageType, action = null, cancelButton = false) {
        let icon = this.shadowRoot.querySelector('#icon');
        let messageText = this.shadowRoot.querySelector('#messageText');
        let messageBox = this.shadowRoot.querySelector('#messageBox');
        let outerPath = this.shadowRoot.querySelector('.outerPath');
        let innerPath = this.shadowRoot.querySelector('.innerPath');

        if(cancelButton)
            this.cancelButton.style.display = 'block';
        else
            this.cancelButton.style.display = 'none';

        messageText.textContent = message;
        messageBox.className = "message-box " + messageType;

        outerPath.setAttribute('d', 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z');
        icon.setAttribute('class', `alert-message-${messageType}-icon`);

        switch(messageType) {
            case 'success':
                innerPath.setAttribute('d', 'M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z');
                break;
            case 'warning':
                innerPath.setAttribute('d', 'M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z');
                break;
            case 'danger':
                innerPath.setAttribute('d', 'M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z');
                break;
            case 'info':
                innerPath.setAttribute('d', 'M8,2 C6.34314,2 5,3.34314 5,5 C5,5.55228 5.44772,6 6,6 C6.55228,6 7,5.55228 7,5 C7,4.44771 7.44772,4 8,4 C8.55228,4 9,4.44771 9,5 C9,5.89443 8.55229,6.44772 7.70711,7.29289 L7,8 C7,8.55228 7.44772,9 8,9 C8.55228,9 9,8.55228 9,8 L9,8.29289 C10.6569,6.63604 12,5.34315 12,5 C12,3.34314 10.6569,2 9,2 L8,2 Z M8,10 C7.44772,10 7,10.4477 7,11 C7,11.5523 7.44772,12 8,12 C8.55228,12 9,11.5523 9,11 C9,10.4477 8.55228,10 8,10 L8,10 Z');
                break;
        }

        this.style.display = 'flex';

        this.confirmButton.style.display = 'none';

        if(action === null)
            return;

        // if a callback was provided, then we know we're processing a confirmation
        if(typeof action === 'function')
        {
            this.callbackFunction = action;
            this.confirmButton.style.display = 'block';
        }
        // if provided action value is a number, then we know we want to auto hide after this number of milliseconds
        else if(!isNaN(Number(action)))
        {
            setTimeout(()=>{
                this.hide();
            }, parseInt(action));
        }

    }

    hide() {
        this.shadowRoot.querySelector('#messageText').textContent = '';
        this.style.display = 'none';
        this.confirmButton.style.display = 'none';
        this.callbackFunction = null;
    }
}

export default AlertMessage;