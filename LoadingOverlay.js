class LoadingOverlay extends HTMLElement {
    constructor() {
        super();
        this.shown = false;
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
            .loader {
                position: relative;
                width: 120px;
                height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .spinner {
                border: 12px solid #D8F3FE;
                border-radius: 50%;
                border-top: 12px solid #3498db;
                width: 100%;
                height: 100%;
                position: absolute;
                -webkit-animation: spin 2s linear infinite;
                animation: spin 2s linear infinite;
            }
            .loaderText {
                font-weight: bold;
                color: #3498db;
                z-index: 1;
            }
            @-webkit-keyframes spin {
                0% { -webkit-transform: rotate(0deg); }
                100% { -webkit-transform: rotate(360deg); }
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
        <div class="loader">
            <div class="spinner"></div>
            <div class="loaderText"></div>
        </div>
        `;

    }

    show(val = 'Processing...') {
        this.shown = true;
        this.shadowRoot.querySelector('.loaderText').textContent = val;
        this.style.display = 'flex';
    }

    hide() {
        this.shown = false;
        this.shadowRoot.querySelector('.loaderText').textContent = '';
        this.style.display = 'none';
    }
}

export default LoadingOverlay;