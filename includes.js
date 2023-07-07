import DebugScreenSize from './DebugScreenSize.js';
import AlertMessage from './AlertMessage.js';
import LoadingOverlay from './LoadingOverlay.js';
import AsyncForm from './AsyncForm';


window.customElements.define('debug-screen-size', DebugScreenSize);
window.customElements.define('loading-overlay', LoadingOverlay);
window.customElements.define('alert-message', AlertMessage);
window.AsyncForm = AsyncForm;