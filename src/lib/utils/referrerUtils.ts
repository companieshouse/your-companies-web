import logger from "../Logger";

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

        logger.debug(`redirectPage is returning FALSE`);
        return false;
    } else {
        logger.debug(`redirectPage is returning TRUE, 
        referrer is ${referrer},
        hrefA: ${hrefA},
        hrefB: ${hrefB},
        pageIndicator ${pageIndicator},
        hrefC ${hrefC}
        `);
        return true;
    }

};
