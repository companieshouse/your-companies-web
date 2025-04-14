import logger from "../Logger";

/**
 * Checks if the user has navigated to the current page via an expected route.
 *
 * @param referrer - The URL from which the user arrived at the current page.
 * @param hrefA - Expected previous page URL.
 * @param hrefB - Expected current page URL (to account for language changes).
 * @param pageIndicator - Indicates if the page is valid despite an undefined referrer.
 * @param hrefC - Optional: Expected next page URLs (to account for back navigation).
 * @returns true if the user should be redirected, false otherwise.
 */
export const redirectPage = (
    referrer: string | undefined,
    hrefA: string,
    hrefB: string,
    pageIndicator: boolean,
    hrefC?: string[]
): boolean => {
    if (pageIndicator) {
        logger.debug(`pageIndicator is true, redirectPage returning false`);
        return false;
    }

    referrer = sanitizeReferrer(referrer);

    if (isValidReferrer(referrer, hrefA, hrefB, hrefC)) {
        logger.debug(`redirectPage is returning false`);
        return false;
    }

    logger.debug(
        `redirectPage is returning true, referrer: ${referrer}, hrefA: ${hrefA}, hrefB: ${hrefB}, pageIndicator: ${pageIndicator}, hrefC: ${JSON.stringify(hrefC)}`
    );
    return true;
};

/**
 * Removes trailing slashes from the referrer URL.
 *
 * @param referrer - The referrer URL.
 * @returns The sanitized referrer URL.
 */
const sanitizeReferrer = (referrer: string | undefined): string | undefined => {
    return referrer?.endsWith("/") ? referrer.slice(0, -1) : referrer;
};

/**
 * Checks if the referrer matches any of the expected URLs.
 *
 * @param referrer - The referrer URL.
 * @param hrefA - Expected previous page URL.
 * @param hrefB - Expected current page URL.
 * @param hrefC - Optional: Expected next page URLs.
 * @returns true if the referrer is valid, false otherwise.
 */
const isValidReferrer = (
    referrer: string | undefined,
    hrefA: string,
    hrefB: string,
    hrefC?: string[]
): boolean => {
    if (!referrer) return false;

    const matchesHref = (href: string) =>
        referrer.endsWith(href) ||
        referrer.includes(`${href}?`) ||
        referrer.includes(`${href}&`);

    if (matchesHref(hrefA) || matchesHref(hrefB)) {
        return true;
    }

    if (hrefC && hrefC.some(matchesHref)) {
        return true;
    }

    return false;
};
