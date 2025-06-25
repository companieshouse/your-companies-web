import * as constants from "../constants";
import { getFullUrl } from "../lib/utils/urlUtils";

interface AllowedPageConfig {
    pattern: string;
    paramGuards?: Array<{ paramName: string; sessionKey: string }>;
}

export interface RouteConfig {
    routePattern: string;
    allowedPages: AllowedPageConfig[];
    allowedExternalUrls?: string[];
    defaultRedirect: string;
    sessionFlag?: string;
}

// Centralized config with route patterns
const routeConfigs: RouteConfig[] = [];

// Route configs by journey
// YOUR_COMPANIES_URL as the start point of the service doesn't require configuration
// Add a company journey
// 1) ADD_COMPANY_URL doesn't require configuration
// 2) CONFIRM_COMPANY_DETAILS_URL
const confirmCompanyDetailsConfig = {
    routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
    allowedPages: [
        { pattern: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL) }, // itself
        { pattern: getFullUrl(constants.ADD_COMPANY_URL) } // page prior to it
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(confirmCompanyDetailsConfig);

// 3) CREATE_COMPANY_ASSOCIATION_URL (TODO - add configuration)

// 4) COMPANY_ADDED_SUCCESS_URL (TODO - fix for company auth code service)
const companyAddedSuccessConfig = {
    routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
    allowedPages: [
        { pattern: getFullUrl(constants.COMPANY_ADDED_SUCCESS_URL) }, // itself
        { pattern: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL) } // page prior to it
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(companyAddedSuccessConfig);

// Remove company journey
// 1) REMOVE_COMPANY_URL
const removeCompanyConfig = {
    routePattern: constants.REMOVE_COMPANY_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.REMOVE_COMPANY_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        { pattern: constants.LANDING_URL } // page prior to it
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(removeCompanyConfig);

// 2) REMOVE_COMPANY_CONFIRMED_URL
const removeCompanyConfirmedConfig = {
    routePattern: constants.REMOVE_COMPANY_CONFIRMED_URL,
    allowedPages: [
        { pattern: getFullUrl(constants.REMOVE_COMPANY_CONFIRMED_URL) }, // itself
        {
            pattern: getFullUrl(constants.REMOVE_COMPANY_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(removeCompanyConfirmedConfig);

// Remove authorisation do not restore journey
// 1) REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL
const removeAuthorisationDoNotRestoreConfig = {
    routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        { pattern: constants.LANDING_URL } // page prior to it
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(removeAuthorisationDoNotRestoreConfig);

// 2) CONFIRMATION_AUTHORISATION_REMOVED_URL
const confirmationAuthorisationRemovedConfig = {
    routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
    allowedPages: [
        { pattern: getFullUrl(constants.CONFIRMATION_AUTHORISATION_REMOVED_URL) }, // itself
        {
            pattern: getFullUrl(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(confirmationAuthorisationRemovedConfig);

// Restore your digital authorisation journey
// 1) CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL (TODO - create configuration)

// 2) TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL
const tryRestoringYourDigitalAuthorisationConfig = {
    routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    allowedExternalUrls: [
        constants.ACCOUNT_URL
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(tryRestoringYourDigitalAuthorisationConfig);

// 3) RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL
const restoreYourDigitalAuthorisationSuccessConfig = {
    routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
    allowedPages: [
        { pattern: getFullUrl(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL) }, // itself
        {
            pattern: getFullUrl(constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(restoreYourDigitalAuthorisationSuccessConfig);

// MANAGE_AUTHORISED_PEOPLE_URL is the starting point for a number of journeys and doesn't require configuration
// Add new authorised person journey
// 1) ADD_PRESENTER_URL
const addPresenterConfig = {
    routePattern: constants.ADD_PRESENTER_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.ADD_PRESENTER_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL), //  page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(addPresenterConfig);

// 2) CHECK_PRESENTER_URL
const checkPresenterConfig = {
    routePattern: constants.CHECK_PRESENTER_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.CHECK_PRESENTER_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.ADD_PRESENTER_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(checkPresenterConfig);

// 3) AUTHORISED_PERSON_ADDED_URL
const authorisedPersonAddedConfig = {
    routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.CHECK_PRESENTER_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(authorisedPersonAddedConfig);

// Cancel a new authorised person
// 1) COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL
const cancelPersonConfig = {
    routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER },
                { paramName: constants.USER_EMAIL, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL), //  page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(cancelPersonConfig);

// 2) MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL
const confirmationCancelPersonConfig = {
    routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER },
                { paramName: constants.USER_EMAIL, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(confirmationCancelPersonConfig);

// Resend email to a new authorised person journey
// 1) MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL (TODO - check if works as the journey is redirected to the landing page)
const manageAuthorisedPeopleEmailResentConfig = {
    routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL), // itself
            paramGuards: [
                { paramName: constants.USER_EMAIL, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL), //  page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(manageAuthorisedPeopleEmailResentConfig);

// 2) MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL (TODO - check if works as the journey is redirected to the landing page)
const confirmationEmailResentConfig = {
    routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL), // page prior to it
            paramGuards: [
                { paramName: constants.USER_EMAIL, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(confirmationEmailResentConfig);

// Restore digital authorisation for a user journey
// 1) SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL
const sendEmailInvitationToBeDigitallyAuthorisedConfig = {
    routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL), // itself
            paramGuards: [
                { paramName: constants.ASSOCIATIONS_ID, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL), //  page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(sendEmailInvitationToBeDigitallyAuthorisedConfig);

// 2) MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL (TODO - fix as it redirects to the landing page)
const confirmationDigitalAuthorisationRestoredConfig = {
    routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.ASSOCIATIONS_ID, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(confirmationDigitalAuthorisationRestoredConfig);

// Remove authorised person journey
// 1) COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL
const authenticationCodeRemovedConfig = {
    routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER },
                { paramName: constants.USER_EMAIL, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL), //  page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(authenticationCodeRemovedConfig);

// 2) REMOVE_ASSOCIATION_URL (TODO - create configuration)

// 3a) REMOVED_THEMSELVES_URL
const removeThemselvesConfig = {
    routePattern: constants.REMOVED_THEMSELVES_URL,
    allowedPages: [
        { pattern: getFullUrl(constants.REMOVED_THEMSELVES_URL) }, // itself
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(removeThemselvesConfig);

// 3b) MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL
const confirmationPersonRemovedConfig = {
    routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER },
                { paramName: constants.USER_EMAIL, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(confirmationPersonRemovedConfig);

const companyInvitationsDeclineConfig = {
    routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.COMPANY_INVITATIONS_DECLINE_URL), // itself
            paramGuards: [
                { paramName: constants.ASSOCIATIONS_ID, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID }
            ]
        },
        { pattern: getFullUrl(constants.COMPANY_INVITATIONS_URL) } // page prior to it
    ],
    defaultRedirect: getFullUrl(constants.COMPANY_INVITATIONS_URL)
};
routeConfigs.push(companyInvitationsDeclineConfig);

const companyInvitationsAcceptConfig = {
    routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.COMPANY_INVITATIONS_ACCEPT_URL), // itself
            paramGuards: [
                { paramName: constants.ASSOCIATIONS_ID, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID }
            ]
        },
        { pattern: getFullUrl(constants.COMPANY_INVITATIONS_URL) } // page prior to it
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(companyInvitationsAcceptConfig);

const presenterAlreadyAddedConfig = {
    routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
    allowedPages: [
        {
            pattern: getFullUrl(constants.PRESENTER_ALREADY_ADDED_URL), // itself
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        },
        {
            pattern: getFullUrl(constants.CHECK_PRESENTER_URL), // page prior to it
            paramGuards: [
                { paramName: constants.COMPANY_NUMBER, sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER }
            ]
        }
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfigs.push(presenterAlreadyAddedConfig);

export default routeConfigs;
