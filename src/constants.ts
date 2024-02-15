import { getEnvironmentValue } from "./lib/utils/environmentValue";

// session.extra_data
export const COMPANY_NUMBER: string = "companyNumber";
export const COMPANY_PROFILE = "companyProfile";
export const USER_EMAIL = "userEmail";
export const AUTHORISED_PERSON_EMAIL = "authorisedPersonEmail";

// Paths to Nunjucks template files
export const ERROR_400_TEMPLATE = "partials/error_400";
export const YOUR_COMPANIES_TEMPLATE_FOLDER = "router_views/your_companies";
export const YOUR_COMPANIES_PAGE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/your_companies`;
export const ADD_COMPANY_PAGE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/add_company`;
export const CONFIRM_COMPANY_PAGE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/confirm_company_details`;
export const COMPANY_ADDED_SUCCESS_PAGE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/confirmation_company_added`;
export const MANAGE_AUTHORISED_PEOPLE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/manage_authorised_people`;

// English and Welsh translation file names
export const COMMON = "common";
export const YOUR_COMPANIES_LANG = "your-companies";
export const ADD_COMPANY_LANG = "add-company";
export const CONFIRM_COMPANY_LANG = "confirm-company-details";
export const COMPANY_ADD_SUCCESS = "confirmation-company-added";
export const COMPANY_STATUS_LANG = "company-status";
export const COMPANY_TYPE_LANG = "company-type";
export const MANAGE_AUTHORISED_PEOPLE_LANG = "manage-authorised-people";

// Routing paths
export const LANDING_URL = "/your-companies";
export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${COMPANY_NUMBER}`;
export const ADD_COMPANY_URL = "/add-company";
export const YOUR_COMPANIES_URL = "/";
export const YOUR_COMPANIES_ADD_COMPANY_URL = `${LANDING_URL}${ADD_COMPANY_URL}`;
export const CONFIRM_COMPANY_DETAILS_URL = "/confirm-company-details";
export const COMPANY_ADDED_SUCCESS_URL = COMPANY_AUTH_PROTECTED_BASE + "/confirmation-company-added";
export const YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL = `${LANDING_URL}${CONFIRM_COMPANY_DETAILS_URL}`;
export const YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL = `${LANDING_URL}${COMPANY_ADDED_SUCCESS_URL}`;
export const CREATE_TRANSACTION_PATH_FULL = LANDING_URL + `${COMPANY_AUTH_PROTECTED_BASE}/transaction`;
export const CREATE_TRANSACTION_PATH = `${COMPANY_AUTH_PROTECTED_BASE}/transaction`;
export const MANAGE_AUTHORISED_PEOPLE_URL = `/manage-authorised-people/:${COMPANY_NUMBER}`;
export const YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL = `${LANDING_URL}${MANAGE_AUTHORISED_PEOPLE_URL}`;
export const ADD_NEW_AUTHORISED_PERSON_URL = "/add-presenter";
export const YOUR_COMPANIES_ADD_NEW_AUTHORISED_PERSON_URL = `${LANDING_URL}${ADD_NEW_AUTHORISED_PERSON_URL}`;
export const CANCEL_PERSON_URL = `/cancel-person/:${USER_EMAIL}`;
export const YOUR_COMPANIES_CANCEL_PERSON_URL = `${LANDING_URL}${CANCEL_PERSON_URL}`;
export const MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL = `/manage-authorised-people-email-resent/:${USER_EMAIL}`;
export const YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL = `${LANDING_URL}${MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL}`;
export const AUTHENTICATION_CODE_REMOVE_URL = `/authentication-code-remove/:${USER_EMAIL}`;
export const YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL = `${LANDING_URL}${COMPANY_AUTH_PROTECTED_BASE}${AUTHENTICATION_CODE_REMOVE_URL}`;

// Error message keys
export const ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE = "enter_a_company_number_for_a_company_that_is_active";
export const ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG = "enter_a_company_number_that_is_8_characters_long";
export const THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT = "this_company_has_already_been_added_to_your_account";
export const ENTER_A_COMPANY_NUMBER = "enter_a_company_number";
export const ERRORS_EMAIL_REQUIRED = "errors_email_required";
export const ERRORS_EMAIL_INVALID = "errors_email_invalid";
export const ERRORS_EMAIL_ALREADY_AUTHORISED = "errors_email_already_authorised";

// HTTP Methods
export const GET = "GET";
export const POST = "POST";

// Status
export const COMPANY_STATUS_ACTIVE = "active";

// Associations
export const COMPNANY_ASSOCIATED_WITH_USER = "company associated with user";
export const COMPNANY_NOT_ASSOCIATED_WITH_USER = "company not associated with user";

// APP config
export const CHS_API_KEY = getEnvironmentValue("CHS_API_KEY", "chs.api.key");
export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");

export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER");
export const CHS_URL = getEnvironmentValue("CHS_URL");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET");

// Booleans
export const TRUE = "true";

// various
export const NOT_PROVIDED = "Not provided";
export const CONFIRMED = "Confirmed";
export const VALID_EMAIL_REGEX_PATTERN = ".+[@].+[.].+";

export const addToPages = (str:string, fromObj:Record<string, string>) => {
    const newObj:Record<string, string> = {};
    Object.keys(fromObj).forEach(key => {
        newObj[key] = str + fromObj[key];
    });
    return newObj;
};

export const pages:Record<string, string> = {
    ADD_PRESENTER: "add-presenter",
    CHECK_PRESENTER: "add-presenter-check-details"
} as const;
export const paths = addToPages("/", pages);
export const pathsWithCompanyAuth = addToPages(COMPANY_AUTH_PROTECTED_BASE, paths);
export const fullPathsWithCompanyAuth = addToPages(LANDING_URL, pathsWithCompanyAuth);
