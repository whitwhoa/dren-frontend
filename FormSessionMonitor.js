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
        console.log('yeet001');
        let formSessionMonitorInstance = this;
        setInterval(() => {

            let expiryTimeInMs = this.sessionExpirationTime * 1000;

            const currentTimeInMs = Date.now();
            const fiveMinutesInMs = 18 * 60 * 1000;

            if ((expiryTimeInMs - currentTimeInMs) <= fiveMinutesInMs) {
                console.log('here001');
                this.alertMessage.show('Your session is about to expire. To continue without interruption please click the "Ok" button', 'warning', ()=>{
                    console.log('Button Clicked: ' + formSessionMonitorInstance.sessionExpirationTime);
                });
            }

        }, 60000);
    }

}

export default FormSessionMonitor;