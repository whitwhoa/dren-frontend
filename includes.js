const DebugScreenSize = require('./DebugScreenSize.js');
const AlertMessage = require('./AlertMessage.js');
const LoadingOverlay = require('./LoadingOverlay.js');
const AsyncForm = require('./AsyncForm');


window.customElements.define('debug-screen-size', DebugScreenSize);
window.customElements.define('loading-overlay', LoadingOverlay);
window.customElements.define('alert-message', AlertMessage);
window.AsyncForm = AsyncForm;