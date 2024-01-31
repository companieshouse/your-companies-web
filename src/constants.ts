import { getEnvironmentValue } from "./lib/utils/environmentValue";

// Paths to Nunjucks template files
export const ERROR_400_TEMPLATE = "partials/error_400";
export const YOUR_COMPANIES_TEMPLATE_FOLDER = "router_views/your_companies";
export const YOUR_COMPANIES_PAGE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/your_companies`;
export const ADD_COMPANY_PAGE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/add_company`;
export const MANAGE_AUTHORISED_PEOPLE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/manage_authorised_people`;

// English and Welsh translation file names
export const COMMON = "common";
export const YOUR_COMPANIES_LANG = "your-companies";
export const ADD_COMPANY_LANG = "add-company";

// Routing paths
export const LANDING_URL = "/your-companies";
export const ADD_COMPANY_URL = "/add-company";
export const YOUR_COMPANIES_URL = "/";
export const YOUR_COMPANIES_ADD_COMPANY_URL = `${LANDING_URL}${ADD_COMPANY_URL}`;
export const CONFIRM_COMPANY_DETAILS_URL = "/confirm-company-details";
export const YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL = `${LANDING_URL}${CONFIRM_COMPANY_DETAILS_URL}`;
export const MANAGE_AUTHORISED_PEOPLE_URL = "/manage-authorised-people";

// Error message keys
export const ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE = "enter_a_company_number_for_a_company_that_is_active";
export const ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG = "enter_a_company_number_that_is_8_characters_long";
export const THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT = "this_company_has_already_been_added_to_your_account";
export const ENTER_A_COMPANY_NUMBER = "enter_a_company_number";

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

// session.extra_data
export const COMPANY_NUMBER: string = "companyNumber";
export const COMPANY_PROFILE = "companyProfile";

// Booleans
export const TRUE = "true";
