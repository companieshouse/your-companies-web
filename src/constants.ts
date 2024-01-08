import { getEnvironmentValue } from "./lib/utils/environmentValue";

// Paths to Nunjucks template files
export const ERROR_400_TEMPLATE = "partials/error_400";
export const YOUR_COMPANIES_TEMPLATE_FOLDER = "router_views/your_companies";
export const YOUR_COMPANIES_PAGE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/your_companies`;
export const ADD_COMPANY_PAGE_TEMPLATE = `${YOUR_COMPANIES_TEMPLATE_FOLDER}/add_company`;

// English and Welsh translation file names
export const YOUR_COMPANIES_LANG = "your-companies";
export const ADD_COMPANY_LANG = "add-company";

// Routing paths
export const LANDING_URL = "/your-companies";
export const ADD_COMPANY_URL = "/add-company";
export const YOUR_COMPANIES_URL = "/";
export const YOUR_COMPANIES_ADD_COMPANY_URL = `${LANDING_URL}${ADD_COMPANY_URL}`;
export const CONFIRM_COMPANY_DETAILS_URL = "/confirm-company-details";
export const YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL = `${LANDING_URL}${CONFIRM_COMPANY_DETAILS_URL}`;

// API paths
export const COMPANY_INFO_API_URL = "/companies";

// Error message keys
export const YOU_MUST_ENTER_A_COMPANY_NUMBER = "you_must_enter_a_company_number";
export const THERE_IS_NO_COMPANY_REGISTERED = "there_is_no_company_registered";

// HTTP Methods
export const GET = "GET";
export const POST = "POST";

// Status
export const COMPANY_STATUS_ACTIVE = "active";

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
