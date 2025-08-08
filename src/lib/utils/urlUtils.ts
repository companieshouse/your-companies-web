import * as constants from "../../constants";
import { sanitizeUrl } from "@braintree/sanitize-url";

/**
 * List of whitelisted URLs.
 */
const WHITELISTED_URLS: string[] = [
    `${constants.LANDING_URL}${constants.HEALTHCHECK_URL}`
];

/**
 * Checks if a given URL is whitelisted.
 * @param url - The URL to check.
 * @returns True if the URL is whitelisted, false otherwise.
 */
export const isWhitelistedUrl = (url: string): boolean => WHITELISTED_URLS.includes(url);

/**
 * Adds or updates the language parameter in a URL.
 * @param url - The URL to modify.
 * @param lang - The language code to add or update.
 * @returns The modified URL.
 */
export const addLangToUrl = (url: string, lang?: string): string => {
    const sanitizedUrl = sanitizeUrl(url).replace("cf=true", "cf=false");

    if (!lang) {
        return sanitizedUrl;
    }

    const langParam = `lang=${lang}`;
    if (sanitizedUrl.includes("lang=cy") || sanitizedUrl.includes("lang=en")) {
        return sanitizedUrl.replace(/lang=(cy|en)/, langParam);
    }

    const separator = sanitizedUrl.includes("?") ? "&" : "?";
    return `${sanitizedUrl}${separator}${langParam}`;
};

/**
 * Constructs the full URL for a given path.
 * @param path - The relative path.
 * @returns The full URL.
 */
export const getFullUrl = (path: string): string => `${constants.LANDING_URL}${path}`;

/**
 * Constructs the URL for managing authorized people for a company.
 * @param companyNumber - The company number.
 * @returns The relative URL.
 */
export const getManageAuthorisedPeopleUrl = (companyNumber: string): string =>
    `/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`;

/**
 * Constructs the full URL for managing authorized people for a company.
 * @param companyNumber - The company number.
 * @returns The full URL.
 */
export const getManageAuthorisedPeopleFullUrl = (companyNumber: string): string =>
    getFullUrl(getManageAuthorisedPeopleUrl(companyNumber));

/**
 * Constructs the URL for adding a presenter to a company.
 * @param companyNumber - The company number.
 * @returns The relative URL.
 */
export const getAddPresenterUrl = (companyNumber: string): string =>
    `/${constants.ADD_PRESENTER_PAGE}/${companyNumber}`;

/**
 * Constructs the full URL for adding a presenter to a company.
 * @param companyNumber - The company number.
 * @returns The full URL.
 */
export const getAddPresenterFullUrl = (companyNumber: string): string =>
    getFullUrl(getAddPresenterUrl(companyNumber));

/**
 * Constructs the full URL for accepting a company invitation.
 * @param associationId - The association ID.
 * @returns The full URL.
 */
export const getCompanyInvitationsAcceptFullUrl = (associationId: string): string =>
    getFullUrl(`/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/${associationId}`);

/**
 * Constructs the full URL for declining a company invitation.
 * @param associationId - The association ID.
 * @returns The full URL.
 */
export const getCompanyInvitationsDeclineFullUrl = (associationId: string): string =>
    getFullUrl(`/${constants.COMPANY_INVITATIONS_DECLINE_PAGE}/${associationId}`);

/**
 * Constructs the URL for checking a presenter for a company.
 * @param companyNumber - The company number.
 * @returns The relative URL.
 */
export const getCheckPresenterUrl = (companyNumber: string): string =>
    `/${constants.CHECK_PRESENTER_PAGE}/${companyNumber}`;

/**
 * Constructs the full URL for checking a presenter for a company.
 * @param companyNumber - The company number.
 * @returns The full URL.
 */
export const getCheckPresenterFullUrl = (companyNumber: string): string =>
    getFullUrl(getCheckPresenterUrl(companyNumber));

/**
 * Constructs the full URL for company added success page.
 * @param companyNumber - The company number.
 * @returns The full URL.
 */
export const getCompanyAddedSuccessFullUrl = (companyNumber: string): string =>
    getFullUrl(`/company/${companyNumber}/confirmation-company-added`);

/**
 * Constructs the full URL for attempting to restore digital authorisation for a given company.
 *
 * @param companyNumber - The unique identifier of the company.
 * @returns The full URL as a string for restoring digital authorisation.
 */
export const getTryRestoringYourDigitalAuthorisationFullUrl = (companyNumber: string): string =>
    getFullUrl(`/company/${companyNumber}${constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_PARTIAL_URL}`);
