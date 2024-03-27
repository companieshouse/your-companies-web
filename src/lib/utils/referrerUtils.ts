export const redirectPage = (referrer: string|undefined, hrefA:string, hrefB: string, hrefC = "Not Applicable"):boolean => {

    if (referrer?.endsWith("/")) {
        referrer = referrer.substring(0, referrer.length - 1);
    }

    if (referrer?.endsWith(hrefA) || referrer?.includes(hrefA + "?") || referrer?.includes(hrefA + "&") || referrer?.endsWith(hrefB) || referrer?.includes(hrefB + "?") || referrer?.includes(hrefB + "&") || referrer?.endsWith(hrefC) || referrer?.includes(hrefC + "?") || referrer?.includes(hrefC + "&")) {
        return false;
    } else {
        return true;
    }

};
