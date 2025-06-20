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
export const CONFIRMED_COMPANY_FOR_ASSOCIATION = "confirmedCompanyForAssociation";
export const USER_ASSOCIATIONS = "userAssociations";
export const ASSOCIATIONS_ID = "associationId";
export const REMOVE_PERSON = "removePerson";
export const USER_NAME = "userName";
export const PROPOSED_COMPANY_NUM = "proposedCompanyNumber";
export const PROPOSED_EMAIL = "proposedEmail";
export const ASSOCIATION_STATE_CHANGED_FOR = "associationStateChagedFor";
export const REMOVED_THEMSELVES_FROM_COMPANY = "removedThemselvesFromCompany";
export const USER_EMAILS_ARRAY = "userEmailsArray";
export const CURRENT_COMPANY_NUM = "currentCompanyNumber";
export const LAST_REMOVED_COMPANY_NAME = "lastRemovedCompanyName";
export const LAST_REMOVED_COMPANY_NUMBER = "lastRemovedCompanyNumber";
export const REMOVE_AUTHORISATION_COMPANY_NAME = "removeAuthorisationCompanyName";
export const REMOVE_AUTHORISATION_COMPANY_NUMBER = "removeAuthorisationCompanyNumber";
// query params
export const CLEAR_FORM = "cf";
export const CLEAR_FORM_TRUE = "?cf=true";
export const MANAGE_AUTHORISED_PEOPLE_INDICATOR = "manageAuthorisedPeopleIndicator";
export const CONFIRM_COMPANY_DETAILS_INDICATOR = "confirmCompanyDetailsIndicator";
export const CANCEL_URL_EXTRA = "cancelPersonUrlExtraData";
export const REMOVE_URL_EXTRA = "removePersonUrlExtraData";
export const REMOVE_COMPANY_URL_EXTRA = "removeCompanyUrlExtraData";
export const CSRF_ERRORS = "csrfErrors";
export const REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL_EXTRA = "removeAuthorisationDoNotRestoreUrlExtraData";

// Paths to Nunjucks template files
export const SERVICE_UNAVAILABLE_TEMPLATE = "partials/service_unavailable";

// English and Welsh translation
export const COMMON = "common";
export const COMPANY_STATUS = "company-status";
export const COMPANY_TYPE = "company-type";

// English and Welsh translation files AND Nunjucks template files
export const YOUR_COMPANIES_PAGE = "your-companies";
export const ADD_COMPANY_PAGE = "add-company";
export const REMOVE_COMPANY_PAGE = "remove-company";
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
export const REMOVE_COMPANY_CONFIRMED = "confirmation-company-removed";
export const REMOVED_THEMSELVES = "confirmation-person-removed-themselves";
export const PRESENTER_ALREADY_ADDED_PAGE = "presenter-already-added";
export const SERVICE_UNAVAILABLE = "service-unavailable";
export const RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE = "confirmation-your-digital-authorisation-restored";
export const SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_PAGE = "send-email-invitation-to-be-digitally-authorised";
export const REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE = "remove-authorisation-do-not-restore";
export const CONFIRMATION_AUTHORISATION_REMOVED_PAGE = "confirmation-authorisation-removed";

// Routing paths
export const LANDING_URL = "/your-companies";
export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${COMPANY_NUMBER}`;
export const ADD_COMPANY_URL = `/${ADD_COMPANY_PAGE}`;
export const YOUR_COMPANIES_URL = "/";
export const CONFIRM_COMPANY_DETAILS_URL = `/${CONFIRM_COMPANY_PAGE}`;
export const COMPANY_ADDED_SUCCESS_URL = `/${COMPANY_ADD_SUCCESS_PAGE}`;
export const REMOVE_COMPANY_CONFIRMED_URL = `/${REMOVE_COMPANY_CONFIRMED}`;
export const CREATE_COMPANY_ASSOCIATION_URL = `${COMPANY_AUTH_PROTECTED_BASE}/create-company-association`;
export const MANAGE_AUTHORISED_PEOPLE_URL = `/${MANAGE_AUTHORISED_PEOPLE_PAGE}/:${COMPANY_NUMBER}`;
export const CONFIRMATION_PERSON_ADDED_URL = "/confirmation-person-added";
export const AUTHORISED_PERSON_ADDED_URL = `${MANAGE_AUTHORISED_PEOPLE_URL}${CONFIRMATION_PERSON_ADDED_URL}`;
export const PRESENTER_ALREADY_ADDED_URL = `/${PRESENTER_ALREADY_ADDED_PAGE}/:${COMPANY_NUMBER}`;
export const ADD_NEW_AUTHORISED_PERSON_URL = `/${ADD_PRESENTER_PAGE}`;
export const CANCEL_PERSON_URL = `/${CANCEL_PERSON_PAGE}/:${USER_EMAIL}`;
export const COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL = `${COMPANY_AUTH_PROTECTED_BASE}${CANCEL_PERSON_URL}`;
export const MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL = `/manage-authorised-people-email-resent/:${USER_EMAIL}`;
export const AUTHENTICATION_CODE_REMOVE_URL = `/authentication-code-remove/:${USER_EMAIL}`;
export const COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL = `${COMPANY_AUTH_PROTECTED_BASE}${AUTHENTICATION_CODE_REMOVE_URL}`;
export const CONFIRMATION_CANCEL_PERSON_URL = "/confirmation-cancel-person";
export const AUTHORISATION_EMAIL_RESENT_URL = "/authorisation-email-resent";
export const MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL = `${MANAGE_AUTHORISED_PEOPLE_URL}${CONFIRMATION_CANCEL_PERSON_URL}`;
export const MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL = `${MANAGE_AUTHORISED_PEOPLE_URL}${AUTHORISATION_EMAIL_RESENT_URL}`;
export const ADD_PRESENTER_URL = `/${ADD_PRESENTER_PAGE}/:${COMPANY_NUMBER}`;
export const CHECK_PRESENTER_URL = `/${CHECK_PRESENTER_PAGE}/:${COMPANY_NUMBER}`;
export const COMPANY_INVITATIONS_URL = `/${COMPANY_INVITATIONS_PAGE}`;
export const COMPANY_INVITATIONS_ACCEPT_URL = `/${COMPANY_INVITATIONS_ACCEPT_PAGE}/:${ASSOCIATIONS_ID}`;
export const COMPANY_INVITATIONS_DECLINE_URL = `/${COMPANY_INVITATIONS_DECLINE_PAGE}/:${ASSOCIATIONS_ID}`;
export const CONFIRMATION_PERSON_REMOVED_URL = "/confirmation-person-removed";
export const MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL = `${MANAGE_AUTHORISED_PEOPLE_URL}${CONFIRMATION_PERSON_REMOVED_URL}`;
export const REMOVE_COMPANY_URL = `/${REMOVE_COMPANY_PAGE}/:${COMPANY_NUMBER}`;
export const REMOVED_THEMSELVES_URL = `/${REMOVED_THEMSELVES}`;
export const SOMETHING_WENT_WRONG_URL = "/something-went-wrong";
export const REMOVE_ASSOCIATION_URL = `/:${COMPANY_NUMBER}/remove-association`;
export const HEALTHCHECK_URL = "/healthcheck";
export const REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL = `/${REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE}/:${COMPANY_NUMBER}`;
export const CONFIRMATION_AUTHORISATION_REMOVED_URL = `/${CONFIRMATION_AUTHORISATION_REMOVED_PAGE}`;
export const CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL = `/restore-your-digital-authorisation/:${COMPANY_NUMBER}/${CONFIRM_COMPANY_PAGE}`;
export const TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_PARTIAL_URL = "/try-restoring-your-digital-authorisation";
export const TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL = `${COMPANY_AUTH_PROTECTED_BASE}${TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_PARTIAL_URL}`;
export const RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL = `/${RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE}`;
export const SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL = `/${SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_PAGE}`;
export const SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL = `${SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL}/:${ASSOCIATIONS_ID}`;
export const CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL = "/confirmation-digital-authorisation-restored";
export const MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL = `${MANAGE_AUTHORISED_PEOPLE_URL}${CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL}`;

// External URLs
export const CHANGE_COMPANY_AUTH_CODE_URL = "https://www.gov.uk/guidance/company-authentication-codes-for-online-filing#change-or-cancel-your-code";
export const AUTHORISATION_BANNER_REQUEST_AUTHENTICATION_CODE_URL = "https://www.gov.uk/guidance/company-authentication-codes-for-online-filing";
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
export const YOU_MUST_SELECT_AN_OPTION = "you_must_select_an_option";

// HTTP Methods
export const GET = "GET";
export const POST = "POST";

// Status
export const COMPANY_STATUS_ACTIVE = "active";
export const COMPANY_STATUS_INACTIVE = "inactive";

// Associations
export const USER_REMOVED_FROM_COMPANY_ASSOCIATIONS = "user removed from company associations";
export const USER_NOT_REMOVED_FROM_COMPANY_ASSOCIATIONS = "user not removed from company associations";

// APP config
export const CHS_API_KEY = getEnvironmentValue("CHS_API_KEY", "chs.api.key");
export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");
export const INTERNAL_API_URL = getEnvironmentValue("INTERNAL_API_URL");
export const OAUTH2_CLIENT_ID = getEnvironmentValue(`OAUTH2_CLIENT_ID`);
export const OAUTH2_CLIENT_SECRET = getEnvironmentValue(`OAUTH2_CLIENT_SECRET`);
export const ACCOUNT_LOCAL_URL = getEnvironmentValue("ACCOUNT_LOCAL_URL");
export const ACCOUNT_URL = getEnvironmentValue("ACCOUNT_URL");

export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER");
export const CHS_URL = getEnvironmentValue("CHS_URL");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET");
export const ENV_NAME = getEnvironmentValue("ENV_NAME");

export const SERVICE_NAME = "Your companies";

// Booleans
export const TRUE = "true";

// various
export const NOT_PROVIDED = "Not provided";
export const CONFIRMED = "confirmed";
export const YES = "yes";
export const CONFIRM = "confirm";
export const REFRESH_TOKEN_GRANT_TYPE = "refresh_token";

// matomo tags for the goals
export const MATOMO_ADD_COMPANY_GOAL_ID = getEnvironmentValue("MATOMO_ADD_COMPANY_GOAL_ID");
export const MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID = getEnvironmentValue("MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID");
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
