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
const routeConfig: RouteConfig[] = [];
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
routeConfig.push(confirmationCancelPersonConfig);

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
routeConfig.push(confirmationEmailResentConfig);

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
routeConfig.push(manageAuthorisedPeopleEmailResentConfig);

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
routeConfig.push(authorisedPersonAddedConfig);

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
routeConfig.push(confirmationPersonRemovedConfig);

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
routeConfig.push(confirmationDigitalAuthorisationRestoredConfig);

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
routeConfig.push(authenticationCodeRemovedConfig);

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
routeConfig.push(removeThemselvesConfig);

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
routeConfig.push(removeCompanyConfig);

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
routeConfig.push(removeCompanyConfirmedConfig);

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
routeConfig.push(cancelPersonConfig);

const confirmCompanyDetailsConfig = {
    routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
    allowedPages: [
        { pattern: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL) }, // itself
        { pattern: getFullUrl(constants.ADD_COMPANY_URL) } // page prior to it
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfig.push(confirmCompanyDetailsConfig);

const companyAddedSuccessConfig = {
    routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
    allowedPages: [
        { pattern: getFullUrl(constants.COMPANY_ADDED_SUCCESS_URL) }, // itself
        { pattern: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL) } // page prior to it
    ],
    defaultRedirect: constants.LANDING_URL
};
routeConfig.push(companyAddedSuccessConfig);

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
routeConfig.push(addPresenterConfig);

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
routeConfig.push(checkPresenterConfig);

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
routeConfig.push(companyInvitationsDeclineConfig);

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
routeConfig.push(companyInvitationsAcceptConfig);

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
routeConfig.push(presenterAlreadyAddedConfig);

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
routeConfig.push(tryRestoringYourDigitalAuthorisationConfig);

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
routeConfig.push(restoreYourDigitalAuthorisationSuccessConfig);

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
routeConfig.push(sendEmailInvitationToBeDigitallyAuthorisedConfig);

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
routeConfig.push(removeAuthorisationDoNotRestoreConfig);

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
routeConfig.push(confirmationAuthorisationRemovedConfig);

export default routeConfig;
