export const redirectPage = (referrer: string | undefined, hrefA: string, hrefB: string, pageIndicator: boolean, hrefC?: string): boolean => {

    if (referrer?.endsWith("/")) {
        referrer = referrer.substring(0, referrer.length - 1);
    }

    if (referrer && (referrer.endsWith(hrefA) ||
        referrer.includes(hrefA + "?") ||
        referrer.includes(hrefA + "&") ||
        referrer.endsWith(hrefB) ||
        referrer.includes(hrefB + "?") ||
        referrer.includes(hrefB + "&") ||
        (hrefC !== undefined && (referrer.endsWith(hrefC) ||
            referrer.includes(hrefC + "?") ||
            referrer.includes(hrefC + "&"))) || pageIndicator === true)) {
        return false;
    } else {
        return true;
    }

};
