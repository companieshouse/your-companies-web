import * as constants from "../../constants";
import { sanitizeUrl } from "@braintree/sanitize-url";

export const getUrlWithCompanyNumber = (url: string, companyNumber: string): string =>
    url.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);

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

export const getManageAuthorisedPeopleUrl = (url: string, companyNumber:string):string => {
    if (url.includes(constants.CONFIRMATION_CANCEL_PERSON_URL)) {
        return constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber) +
            constants.CONFIRMATION_CANCEL_PERSON_URL;
    }
    if (url.includes(constants.CONFIRMATION_PERSON_REMOVED_URL)) {
        return constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
    }
    if (url.includes(constants.AUTHORISATION_EMAIL_RESENT_URL)) {
        return constants.YOUR_COMPANIES_CONFIRMATION_EMAIL_RESENT_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
    }
    if (url.includes(constants.CONFIRMATION_PERSON_ADDED)) {
        return constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
    }
    return constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
};
