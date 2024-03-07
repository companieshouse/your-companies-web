import * as constants from "../../constants";
import { sanitizeUrl } from "@braintree/sanitize-url";

export const getUrlWithCompanyNumber = (url: string, companyNumber: string): string =>
    url.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);

export const addLangToUrl = (url: string, lang: string | undefined): string => {
    const sanitizedUrl = sanitizeUrl(url);

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
