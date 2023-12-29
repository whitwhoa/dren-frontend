class Helpers
{
    static getUriSegments()
    {
        return window.location.pathname.split('/').filter(segment => segment !== "");
    }

    static getKindaUniqueId()
    {
        const timestamp = new Date().getTime();
        const randomFactor = Math.random().toString(36).substring(2, 15);
        return `${timestamp}${randomFactor}`;
    }

    static getQueryParams() {
        const queryParams = {};
        const urlObj = new URL(window.location.href);
        const params = new URLSearchParams(urlObj.search);

        for (const [key, value] of params.entries()) {
            queryParams[key] = value;
        }

        return queryParams;
    }
}

export default Helpers;