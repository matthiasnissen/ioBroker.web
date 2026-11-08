function getRawCookieValue(cookieHeader: string | undefined, cookieName: string): string | undefined {
    const cookie = cookieHeader?.split(';').find(part => part.trim().startsWith(`${cookieName}=`));
    if (!cookie) {
        return undefined;
    }

    const trimmedCookie = cookie.trim();
    return trimmedCookie.slice(cookieName.length + 1);
}

export function getCookieValue(cookieHeader: string | undefined, cookieNames: string | string[]): string | undefined {
    for (const cookieName of Array.isArray(cookieNames) ? cookieNames : [cookieNames]) {
        const value = getRawCookieValue(cookieHeader, cookieName);
        if (value !== undefined) {
            try {
                return decodeURIComponent(value);
            } catch {
                return value;
            }
        }
    }

    return undefined;
}

export function normalizeCookieHeader(
    cookieHeader: string | undefined,
    cookieName: string,
    legacyCookieNames: string[],
): string | undefined {
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
