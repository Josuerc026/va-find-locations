import { MB_SESSION_TOKEN_KEY } from "./constants";

export const setQueryParams = (queryParams: any) => {
    const params = Object.keys(queryParams);
    if (!params.length) return;
    const url = new URL(window.location as any);
    params.forEach((key) => {
        url.searchParams.set(key, queryParams[key]);
    });
    history.pushState(null, '', url);
}

export const getQueryParam = (queryString: string, key: string) => {
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(key);
}

export const getAllQueryParams = (queryString: string): any => {
    const urlParams = new URLSearchParams(queryString);
    return Array.from(urlParams.keys())
        .reduce((acc, val) => ({ ...acc, [val]: urlParams.get(val) }), {});
}

export const generateSessionId = () => {
    const sessionToken = crypto.randomUUID();
    localStorage.setItem(MB_SESSION_TOKEN_KEY, sessionToken);
    return sessionToken;
}
