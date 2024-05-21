import logger from "../Logger";

/**
 * This function checks url parameters predefined in page handlers to see if a user has travelled to their current page via the expected route.
 * This is to prevent users bookmarking and accessing pages mid-way through the user journey, or urls that may no longer exist.
 *
 * @param referrer - redirect url - the url from which the user has arrived from to get to the current url
 *                 - is undefined if a user has bookmarked the page they wish to access
 * @param hrefA - expected previous page url - compared with referrer parameter to confirm if user has travelled from the page prior to the current page in the journey
 * @param hrefB - expected current page url - compared with referrer parameter to account for whether user has changed language on current page, changing the url
 * @param pageIndicator - for when the authentication system causes referrer paramater to be 'undefined'
 *                      - if true, page is not redirected as user has travelled from a valid page
 * @param hrefC - expected next page - compared with referrer parameter to account for whether a user has clicked 'back' to go to the previous page
 *              - optional as not all pages have a page that follows them
 * @returns
 */

export const redirectPage = (referrer: string | undefined, hrefA: string, hrefB: string, pageIndicator: boolean, hrefC?: string): boolean => {

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
        (hrefC !== undefined && (referrer.endsWith(hrefC) ||
            referrer.includes(hrefC + "?") ||
            referrer.includes(hrefC + "&"))))) {

        logger.debug(`redirectPage is returning false`);
        return false;
    } else {
        logger.debug(`redirectPage is returning true, referrer is ${referrer}, hrefA: ${hrefA}, hrefB: ${hrefB}, pageIndicator ${pageIndicator}, hrefC ${hrefC}`);
        return true;
    }

};
