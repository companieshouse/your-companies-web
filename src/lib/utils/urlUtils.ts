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
 * Constructs the full URL for managing authorized people with additional mappings.
 * @param url - The base URL.
 * @param companyNumber - The company number.
 * @returns The full URL.
 */
export const getManageAuthorisedPeopleFullUrl = (url: string, companyNumber: string): string => {
    const baseUrl = getFullUrl(getManageAuthorisedPeopleUrl(companyNumber));

    const urlMappings: Record<string, string> = {
        [constants.CONFIRMATION_PERSON_REMOVED_URL]: constants.CONFIRMATION_PERSON_REMOVED_URL,
        [constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL]: constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL,
        [constants.CONFIRMATION_PERSON_ADDED_URL]: constants.CONFIRMATION_PERSON_ADDED_URL,
        [constants.CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL]: constants.CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL
    };

    for (const [key, value] of Object.entries(urlMappings)) {
        if (url.includes(key)) {
            return `${baseUrl}${value}`;
        }
    }

    return baseUrl;
};

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
 * Constructs the full URL for creating a company association.
 * @param companyNumber - The company number.
 * @returns The full URL.
 */
export const getCreateCompanyAssociationFullUrl = (companyNumber: string): string =>
    getFullUrl(`/company/${companyNumber}/create-company-association`);

/**
 * Constructs the URL for a presenter already added to a company.
 * @param companyNumber - The company number.
 * @returns The relative URL.
 */
export const getPresenterAlreadyAddedUrl = (companyNumber: string): string =>
    `/${constants.PRESENTER_ALREADY_ADDED_PAGE}/${companyNumber}`;

/**
 * Constructs the full URL for confirming an authorized person was added.
 * @param companyNumber - The company number.
 * @returns The full URL.
 */
export const getAuthorisedPersonAddedFullUrl = (companyNumber: string): string =>
    getFullUrl(`/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}${constants.CONFIRMATION_PERSON_ADDED_URL}`);

/**
 * Constructs the URL for removing an authentication code by email.
 * @param associationId - The association id to be removed.
 * @returns The relative URL.
 */
export const getAuthenticationCodeRemoveUrl = (associationId: string): string =>
    `/authentication-code-remove/${associationId}`;

/**
 * Constructs the full URL for removing an authentication code in a company context.
 * @param companyNumber - The company number.
 * @param id - The id of the association being removed.
 * @returns The full URL.
 */
export const getCompanyAuthProtectedAuthenticationCodeRemoveUrl = (companyNumber: string, id: string): string =>
    `/company/${companyNumber}${getAuthenticationCodeRemoveUrl(id)}`;

/**
 * Constructs the URL for removing a company.
 * @param companyNumber - The company number.
 * @returns The relative URL.
 */
export const getRemoveCompanyUrl = (companyNumber: string): string =>
    `/${constants.REMOVE_COMPANY_PAGE}/${companyNumber}`;

/**
 * Constructs the full URL for attempting to restore digital authorisation for a given company.
 *
 * @param companyNumber - The unique identifier of the company.
 * @returns The full URL as a string for restoring digital authorisation.
 */
export const getTryRestoringYourDigitalAuthorisationFullUrl = (companyNumber: string): string =>
    getFullUrl(`/company/${companyNumber}${constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_PARTIAL_URL}`);

/**
 * Constructs the full URL for confirming that digital authorisation has been restored.
 *
 * @param companyNumber - The unique identifier of the company.
 * @returns The full URL as a string for restoring digital authorisation.
 */
export const getConfirmCompanyDetailsForRestoringYourDigitalAuthorisationFullUrl = (companyNumber: string): string =>
    getFullUrl(`/restore-your-digital-authorisation/${companyNumber}/${constants.CONFIRM_COMPANY_PAGE}`);

/**
 * Constructs the URL for sending email to be digitally authorised.
 * @param associationId - The association ID.
 * @returns The relative URL.
 */
export const getSendEmailToBeDigitallyAuthorisedFullUrl = (associationId: string): string =>
    getFullUrl(`${constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}/${associationId}`);

/**
 * Constructs the URL for removing a user's authorisation from a company.
 * @param companyNumber - The company number.
 * @returns The relative URL.
 */
export const getRemoveAuthorisationDoNotRestoreUrl = (companyNumber: string): string =>
    `/${constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE}/${companyNumber}`;
