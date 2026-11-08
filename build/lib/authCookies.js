"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieValue = getCookieValue;
exports.normalizeCookieHeader = normalizeCookieHeader;
function getRawCookieValue(cookieHeader, cookieName) {
    const cookie = cookieHeader?.split(';').find(part => part.trim().startsWith(`${cookieName}=`));
    if (!cookie) {
        return undefined;
    }
    const trimmedCookie = cookie.trim();
    return trimmedCookie.slice(cookieName.length + 1);
}
function getCookieValue(cookieHeader, cookieNames) {
    for (const cookieName of Array.isArray(cookieNames) ? cookieNames : [cookieNames]) {
        const value = getRawCookieValue(cookieHeader, cookieName);
        if (value !== undefined) {
            try {
                return decodeURIComponent(value);
            }
            catch {
                return value;
            }
        }
    }
    return undefined;
}
function normalizeCookieHeader(cookieHeader, cookieName, legacyCookieNames) {
    if (cookieHeader === undefined || getRawCookieValue(cookieHeader, cookieName) !== undefined) {
        return cookieHeader;
    }
    for (const legacyCookieName of legacyCookieNames) {
        const value = getRawCookieValue(cookieHeader, legacyCookieName);
        if (value !== undefined) {
            return `${cookieHeader}; ${cookieName}=${value}`;
        }
    }
    return cookieHeader;
}
//# sourceMappingURL=authCookies.js.map