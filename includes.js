import DebugScreenSize from './DebugScreenSize.js';
import AlertMessage from './AlertMessage.js';
import LoadingOverlay from './LoadingOverlay.js';
import AsyncForm from './AsyncForm';
import FormSessionMonitor from "./FormSessionMonitor";
import LocationSearch from "./LocationSearch";
import Helpers from "./Helpers";
import HelpInfoIcon from "./HelpInfoIcon";


window.customElements.define('debug-screen-size', DebugScreenSize);
window.customElements.define('loading-overlay', LoadingOverlay);
window.customElements.define('alert-message', AlertMessage);
window.customElements.define('location-search', LocationSearch);
window.customElements.define('help-info-icon', HelpInfoIcon);
window.AsyncForm = AsyncForm;
window.FormSessionMonitor = FormSessionMonitor;
window.Helpers = Helpers;

