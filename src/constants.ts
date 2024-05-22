import { getEnvironmentValue } from "./lib/utils/environmentValue";

// session.extra_data
export const COMPANY_NUMBER = "companyNumber";
export const COMPANY_NAME = "companyName";
export const COMPANY_PROFILE = "companyProfile";
export const USER_EMAIL = "userEmail";
export const AUTHORISED_PERSON_EMAIL = "authorisedPersonEmail";
export const REFERER_URL = "refererUrl";
export const CANCEL_PERSON = "cancelPerson";
export const AUTHORISED_PERSON = "authorisedPerson";
export const RESENT_SUCCESS_EMAIL = "resentSuccessEmail";
export const CONFIRMED_COMPANY_FOR_ASSOCIATION = "confirmedCompanyForAssocation";
export const USER_ASSOCIATIONS = "userAssociations";
export const ASSOCIATIONS_ID = "associationId";
export const REMOVE_PERSON = "removePerson";
export const USER_NAME = "userName";
export const PROPOSED_COMPANY_NUM = "proposedCompanyNumber";
export const PROPOSED_EMAIL = "proposedEmail";
export const ASSOCIATION_STATE_RESPONSE = "associationStateResponse";
export const ASSOCIATION_STATE_CHANGED_FOR = "associationStateChagedFor";

// query params
export const CLEAR_FORM = "cf";
export const CLEAR_FORM_TRUE = "?cf=true";
export const MANAGE_AUTHORISED_PEOPLE_INDICATOR = "manageAuthorisedPeopleIndicator";
export const CONFIRM_COMPANY_DETAILS_INDICATOR = "confirmCompanyDetailsIndicator";
export const CANCEL_URL_EXTRA = "cancelPersonUrlExtraData";
export const REMOVE_URL_EXTRA = "removePersonUrlExtraData";

// Paths to Nunjucks template files
export const ERROR_400_TEMPLATE = "partials/error_400";
export const ERROR_404_TEMPLATE = "partials/error_404";

// English and Welsh translation
export const COMMON = "common";
export const COMPANY_STATUS = "company-status";
export const COMPANY_TYPE = "company-type";

// English and Welsh translation files AND Nunjucks template files
export const YOUR_COMPANIES_PAGE = "your-companies";
export const ADD_COMPANY_PAGE = "add-company";
export const CONFIRM_COMPANY_PAGE = "confirm-company-details";
export const COMPANY_ADD_SUCCESS_PAGE = "confirmation-company-added";
export const MANAGE_AUTHORISED_PEOPLE_PAGE = "manage-authorised-people";
export const CANCEL_PERSON_PAGE = "cancel-person";
export const ADD_PRESENTER_PAGE = "add-presenter";
export const CHECK_PRESENTER_PAGE = "add-presenter-check-details";
export const COMPANY_INVITATIONS_PAGE = "company-invitations";
export const COMPANY_INVITATIONS_ACCEPT_PAGE = "company-invitations-accept";
export const COMPANY_INVITATIONS_DECLINE_PAGE = "company-invitations-decline";
export const REMOVE_AUTHORISED_PERSON_PAGE = "remove-authorised-person";

// Routing paths
export const SEPARATOR = "/";
export const LANDING_URL = "/your-companies";
export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${COMPANY_NUMBER}`;
export const ADD_COMPANY_URL = "/add-company";
export const YOUR_COMPANIES_URL = "/";
export const YOUR_COMPANIES_ADD_COMPANY_URL = `${LANDING_URL}${ADD_COMPANY_URL}`;
export const CONFIRM_COMPANY_DETAILS_URL = "/confirm-company-details";
export const COMPANY_ADDED_SUCCESS_URL = "/confirmation-company-added";
export const YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL = `${LANDING_URL}${CONFIRM_COMPANY_DETAILS_URL}`;
export const YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL = `${LANDING_URL}${COMPANY_ADDED_SUCCESS_URL}`;
export const CREATE_COMPANY_ASSOCIATION_PATH_FULL = LANDING_URL + `${COMPANY_AUTH_PROTECTED_BASE}/create-company-association`;
export const CREATE_COMPANY_ASSOCIATION_PATH = `${COMPANY_AUTH_PROTECTED_BASE}/create-company-association`;
export const MANAGE_AUTHORISED_PEOPLE_URL = `/manage-authorised-people/:${COMPANY_NUMBER}`;
export const AUTHORISED_PERSON_ADDED_URL = `/manage-authorised-people/:${COMPANY_NUMBER}/confirmation-person-added`;
export const YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL = `${LANDING_URL}${MANAGE_AUTHORISED_PEOPLE_URL}/confirmation-person-added`;
export const PERSON_NOT_ADDED_URL = `/person-not-added/:${COMPANY_NUMBER}`;
export const YOUR_COMPANIES_AUTHORISED_PERSON_NOT_ADDED_URL = `${LANDING_URL}${PERSON_NOT_ADDED_URL}`;
export const YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL = `${LANDING_URL}${MANAGE_AUTHORISED_PEOPLE_URL}`;
export const ADD_NEW_AUTHORISED_PERSON_URL = "/add-presenter";
export const YOUR_COMPANIES_ADD_NEW_AUTHORISED_PERSON_URL = `${LANDING_URL}${ADD_NEW_AUTHORISED_PERSON_URL}`;
export const CANCEL_PERSON_URL = `/cancel-person/:${USER_EMAIL}`;
export const COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL = `${COMPANY_AUTH_PROTECTED_BASE}${CANCEL_PERSON_URL}`;
export const YOUR_COMPANIES_COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL = `${LANDING_URL}${COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL}`;
export const MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL = `/manage-authorised-people-email-resent/:${USER_EMAIL}`;
export const YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL = `${LANDING_URL}${MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL}`;
export const AUTHENTICATION_CODE_REMOVE_URL = `/authentication-code-remove/:${USER_EMAIL}`;
export const COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL = `${COMPANY_AUTH_PROTECTED_BASE}${AUTHENTICATION_CODE_REMOVE_URL}`;
export const YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL = `${LANDING_URL}${COMPANY_AUTH_PROTECTED_BASE}${AUTHENTICATION_CODE_REMOVE_URL}`;
export const CONFIRMATION_CANCEL_PERSON_URL = "/confirmation-cancel-person";
export const AUTHORISATION_EMAIL_RESENT_URL = "/authorisation-email-resent";
export const MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL = `${MANAGE_AUTHORISED_PEOPLE_URL}${CONFIRMATION_CANCEL_PERSON_URL}`;
export const MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL = `${MANAGE_AUTHORISED_PEOPLE_URL}${AUTHORISATION_EMAIL_RESENT_URL}`;
export const YOUR_COMPANIES_CONFIRMATION_EMAIL_RESENT_URL = `${LANDING_URL}${MANAGE_AUTHORISED_PEOPLE_URL}${AUTHORISATION_EMAIL_RESENT_URL}`;
export const ADD_PRESENTER_URL = `${SEPARATOR}${ADD_PRESENTER_PAGE}${SEPARATOR}:${COMPANY_NUMBER}`;
export const YOUR_COMPANIES_ADD_PRESENTER_URL = LANDING_URL + ADD_PRESENTER_URL;
export const CHECK_PRESENTER_URL = `${SEPARATOR}${CHECK_PRESENTER_PAGE}${SEPARATOR}:${COMPANY_NUMBER}`;
export const YOUR_COMPANIES_CHECK_PRESENTER_URL = LANDING_URL + CHECK_PRESENTER_URL;
export const COMPANY_INVITATIONS_URL = SEPARATOR + COMPANY_INVITATIONS_PAGE;
export const YOUR_COMPANIES_COMPANY_INVITATIONS_URL = `${LANDING_URL}${COMPANY_INVITATIONS_URL}`;
export const COMPANY_INVITATIONS_ACCEPT_URL = `/${COMPANY_INVITATIONS_ACCEPT_PAGE}/:${ASSOCIATIONS_ID}`;
export const YOUR_COMPANIES_COMPANY_INVITATIONS_ACCEPT_URL = LANDING_URL + COMPANY_INVITATIONS_ACCEPT_URL;
export const COMPANY_INVITATIONS_DECLINE_URL = `/${COMPANY_INVITATIONS_DECLINE_PAGE}/:${ASSOCIATIONS_ID}`;
export const YOUR_COMPANIES_COMPANY_INVITATIONS_DECLINE_URL = LANDING_URL + COMPANY_INVITATIONS_DECLINE_URL;
export const CONFIRMATION_PERSON_REMOVED_URL = "/confirmation-person-removed";
export const CONFIRMATION_PERSON_ADDED = "/confirmation-person-added";
export const MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL = `${MANAGE_AUTHORISED_PEOPLE_URL}${CONFIRMATION_PERSON_REMOVED_URL}`;
export const YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL = `${LANDING_URL}${MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL}`;
export const HEALTHCHECK = "/healthcheck";

// Error message keys
export const ENTER_A_COMPANY_NUMBER_FOR_A_COMPANY_THAT_IS_ACTIVE = "enter_a_company_number_for_a_company_that_is_active";
export const ENTER_A_COMPANY_NUMBER_THAT_IS_8_CHARACTERS_LONG = "enter_a_company_number_that_is_8_characters_long";
export const THIS_COMPANY_HAS_ALREADY_BEEN_ADDED_TO_YOUR_ACCOUNT = "this_company_has_already_been_added_to_your_account";
export const ENTER_A_COMPANY_NUMBER = "enter_a_company_number";
export const ERRORS_EMAIL_REQUIRED = "errors_email_required";
export const ERRORS_EMAIL_INVALID = "errors_email_invalid";
export const SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION = "select_yes_if_you_want_to_cancel_authorisation";
export const SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ = "select_if_you_confirm_that_you_have_read";
export const COMPANY_NUMBER_MUST_ONLY_INCLUDE = "company_number_must_only_include";
export const ENTER_A_COMPANY_NUMBER_OR_PART = "enter_a_company_number_or_part";

// HTTP Methods
export const GET = "GET";
export const POST = "POST";

// Status
export const COMPANY_STATUS_ACTIVE = "active";

// Associations
export const USER_REMOVED_FROM_COMPANY_ASSOCIATIONS = "user removed from company associations";
export const USER_NOT_REMOVED_FROM_COMPANY_ASSOCIATIONS = "user not removed from company associations";

// APP config
export const CHS_API_KEY = getEnvironmentValue("CHS_API_KEY", "chs.api.key");
export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");
export const INTERNAL_API_URL = getEnvironmentValue("INTERNAL_API_URL");

export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER");
export const CHS_URL = getEnvironmentValue("CHS_URL");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET");

// Booleans
export const TRUE = "true";

// Matomo
export const MATOMO_LINK_CLICK = "Link Click";
export const MATOMO_BUTTON_CLICK = "Button Click";
export const MATOMO_ADD_COMPANY_BUTTON = "Add a Company Button";
export const MATOMO_VIEW_AND_MANAGE_LINK = "View and Manage Link";
export const MATOMO_CONTINUE_BUTTON = "Continue Button";
export const MATOMO_CONFIRM_AND_CONTINUE_BUTTON = "Confirm and Continue Button";
export const MATOMO_CHOOSE_DIFFERENT_COMPANY_LINK = "Choose a Different Company Link";
export const MATOMO_VIEW_YOUR_COMPANIES_LINK = "View Your Companies Link";
export const MATOMO_ADD_NEW_AUTHORISED_PERSON_BUTTON = "Add a New Authorised Person Button";
export const MATOMO_REMOVE_AUTHORISED_USER_LINK = "Remove Authorised User Link";
export const MATOMO_CANCEL_AUTHORISED_USER_LINK = "Cancel Authorised User Link";
export const MATOMO_RESEND_AUTHORISED_USER_EMAIL_LINK = "Resend Authorised User Email Link";
export const MATOMO_SEARCH_FOR_A_COMPANY_BUTTON = "Search for a Company Button";
export const MATOMO_CANCEL_SEARCH_LINK = "Cancel search link";
export const MATOMO_NO_RESULTS_FROM_SEARCH = "No results - company number search";
export const MATOMO_CONFIRM_AND_SEND_EMAIL_BUTTON = "Confirm and Send Email Button";
export const MATOMO_CHANGE_LINK = "Change Link";
export const MATOMO_REMOVE_AUTHORISATION_BUTTON = "Remove Authorisation Button";
export const MATOMO_CANCEL_LINK = "Cancel Link";
export const MATOMO_CHANGE_THE_AUTHENTICATION_CODE_LINK = "Change the Authentication Code Link";
export const MATOMO_ACCEPT_INVITATION_LINK_ID = "accept-authorised-user-invitation-link";
export const MATOMO_DECLINE_INVITATION_LINK_ID = "decline-authorised-user-invitation-link";
export const MATOMO_ACCEPT_INVITATION_LINK = "Accept Authorised User Invitation Link";
export const MATOMO_DECLINE_INVITATION_LINK = "Decline Authorised User Invitation Link";
export const MATOMO_ADD_COMPANY_GOAL_ID = getEnvironmentValue("MATOMO_ADD_COMPANY_GOAL_ID");
export const MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID = getEnvironmentValue("MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID");

// various
export const NOT_PROVIDED = "Not provided";
export const CONFIRMED = "confirmed";
export const YES = "yes";
export const CONFIRM = "confirm";
/**
 * This is the default number of associations per page that API uses if nothing is provided.
 * It is used by the pagination component and it will normally be max number
 * of associations being displayed at any one time on the your-companies page
 */
export const ITEMS_PER_PAGE = 15;
/**
 * The company number contains 6 to 10 characters, consisting only of uppercase letters and numbers.
 * At least one character must be entered for the search. The regex is /^[0-9A-Z]{1,10}$/
 */
export const COMPANY_NUMBER_SEARCH_VALIDATION_REGEX = /^[0-9A-Z]{1,10}$/;
export const NUMBER_OF_DAYS_INVITATION_IS_VALID = 7;
export const INVITATIONS_PER_PAGE = 1000;
