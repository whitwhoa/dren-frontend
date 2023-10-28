class Helpers
{
    static getUriSegments()
    {
        return window.location.pathname.split('/').filter(segment => segment !== "");
    }
}

export default Helpers;