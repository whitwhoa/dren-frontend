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
}

export default Helpers;