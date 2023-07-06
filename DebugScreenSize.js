class DebugScreenSize extends HTMLElement {
    constructor() {
        super();

        this.style.position = 'fixed';
        this.style.top = '10px';
        this.style.right = '10px';
        this.style.zIndex = '1000';
        this.style.color = 'darkolivegreen';
        this.style.fontWeight = 'bold';
        this.style.padding = '5px 10px';

        this.updateScreenSize = this.updateScreenSize.bind(this);
    }

    connectedCallback() {
        this.updateScreenSize();
        window.addEventListener('resize', this.updateScreenSize);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.updateScreenSize);
    }

    updateScreenSize() {
        let screenSize = window.innerWidth;
        let sizeLabel = '';

        if (screenSize < 576)
            sizeLabel = 'xs';
        else if (screenSize >= 576 && screenSize < 768)
            sizeLabel = 'sm';
        else if (screenSize >= 768 && screenSize < 992)
            sizeLabel = 'md';
        else if (screenSize >= 992 && screenSize < 1200)
            sizeLabel = 'lg';
        else if (screenSize >= 1200 && screenSize < 1400)
            sizeLabel = 'xl';
        else if (screenSize >= 1400)
            sizeLabel = 'xxl';

        this.textContent = sizeLabel;
    }
}

module.exports = DebugScreenSize;