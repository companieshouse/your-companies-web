import logger from "../Logger";

export const redirectPage = (referrer: string | undefined, hrefA: string, hrefB: string, pageIndicator: boolean, hrefC?: string[]): boolean => {

    if (referrer?.endsWith("/")) {
        referrer = referrer.substring(0, referrer.length - 1);
    }
    if (pageIndicator) {
        logger.debug(`pageIndicator is true, redirectPage returning false`);
        return false;
    }

    if (referrer && (referrer.endsWith(hrefA) ||
        referrer.includes(hrefA + "?") ||
        referrer.includes(hrefA + "&") ||
        referrer.endsWith(hrefB) ||
        referrer.includes(hrefB + "?") ||
        referrer.includes(hrefB + "&") ||
        (hrefC !== undefined && (checkMultipleHrefs(referrer, hrefC) ||
            referrer.includes(hrefC + "?") ||
            referrer.includes(hrefC + "&"))))) {

        logger.debug(`redirectPage is returning false`);
        return false;
    } else {
        logger.debug(`redirectPage is returning true, referrer is ${referrer}, hrefA: ${hrefA}, hrefB: ${hrefB}, pageIndicator ${pageIndicator}, hrefC ${JSON.stringify(hrefC)}`);
        return true;
    }

};

const checkMultipleHrefs = (referrer: string, hrefs: string[]): boolean => {
    return hrefs.some(href => referrer.endsWith(href));
};
