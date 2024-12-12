import * as constants from "../../constants";
import { sanitizeUrl } from "@braintree/sanitize-url";

const WHITELISTED_URLS: string[] = [
    constants.LANDING_URL + constants.HEALTHCHECK_URL
];

export const isWhitelistedUrl = (url: string): boolean => WHITELISTED_URLS.includes(url);

export const addLangToUrl = (url: string, lang: string | undefined): string => {
    let sanitizedUrl = sanitizeUrl(url);
    if (sanitizedUrl.includes("cf=true")) {
        sanitizedUrl = sanitizedUrl.replace("cf=true", "cf=false");
    }

    if (lang === undefined || lang === "") {
        return sanitizedUrl;
    }

    if (sanitizedUrl.includes("lang=cy")) {
        return sanitizedUrl.replace("lang=cy", "lang=" + lang);
    }

    if (sanitizedUrl.includes("lang=en")) {
        return sanitizedUrl.replace("lang=en", "lang=" + lang);
    }

    if (sanitizedUrl.includes("?")) {
        return sanitizedUrl + "&lang=" + lang;
    } else {
        return sanitizedUrl + "?lang=" + lang;
    }
};

export const getManageAuthorisedPeopleFullUrl = (url: string, companyNumber: string): string => {
    const baseUrl = getFullUrl(`/${constants.MANAGE_AUTHORISED_PEOPLE_PAGE}/${companyNumber}`);

    if (url.includes(constants.CONFIRMATION_CANCEL_PERSON_URL)) {
        return baseUrl + constants.CONFIRMATION_CANCEL_PERSON_URL;
    }

    if (url.includes(constants.CONFIRMATION_PERSON_REMOVED_URL)) {
        return baseUrl + constants.CONFIRMATION_PERSON_REMOVED_URL;
    }

    if (url.includes(constants.AUTHORISATION_EMAIL_RESENT_URL)) {
        return baseUrl + constants.AUTHORISATION_EMAIL_RESENT_URL;
    }

    if (url.includes(constants.CONFIRMATION_PERSON_ADDED_URL)) {
        return baseUrl + constants.CONFIRMATION_PERSON_ADDED_URL;
    }

    return baseUrl;
};

export const isReferrerIncludes = (referrer: string): boolean => referrer.includes(constants.CONFIRMATION_PERSON_REMOVED_URL) ||
    referrer.includes(constants.CONFIRMATION_CANCEL_PERSON_URL) ||
    referrer.includes(constants.CONFIRMATION_PERSON_ADDED_URL) ||
    referrer.includes(constants.AUTHORISATION_EMAIL_RESENT_URL);

export const getFullUrl = (url: string): string => `${constants.LANDING_URL}${url}`;

export const getAddPresenterFullUrl = (companyNumber: string): string =>
    getFullUrl(`/${constants.ADD_PRESENTER_PAGE}/${companyNumber}`);

export const getCompanyInvitationsAcceptFullUrl = (associatonId: string): string =>
    getFullUrl(`/${constants.COMPANY_INVITATIONS_ACCEPT_PAGE}/${associatonId}`);

export const getCompanyInvitationsDeclineFullUrl = (associatonId: string): string =>
    getFullUrl(`/${constants.COMPANY_INVITATIONS_DECLINE_PAGE}/${associatonId}`);

export const getCheckPresenterFullUrl = (companyNumber: string): string =>
    getFullUrl(`/${constants.CHECK_PRESENTER_PAGE}/${companyNumber}`);

export const getCreateCompanyAssociationFullUrl = (companyNumber: string): string =>
    getFullUrl(`/company/${companyNumber}/create-company-association`);
