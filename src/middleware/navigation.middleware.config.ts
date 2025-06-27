import * as constants from "../constants";
import { getFullUrl } from "../lib/utils/urlUtils";

/**
 * Configuration for parameter guards.
 *
 * @property paramName: the name of the parameter in the URL.
 * @property sessionKey: the key used by the navigation middleware to retrieve the expected value from the session.
 * This mechanism ensures that sensitive URL parameters cannot be tampered with by users
 * (e.g., manually changing a company number in the URL) by validating that the parameter value in the URL
 * matches the value stored in the user's session.
 */
export interface ParamGuard {
    paramName: string;
    sessionKey: string;
}

/**
 * Configuration for allowed pages.
 *
 * @property pattern - The URL pattern that this configuration applies to.
 * @property paramGuards - Optional parameter guards to ensures that sensitive URL parameters cannot be tampered with by users.
 */
interface AllowedPageConfig {
    pattern: string;
    paramGuards?: ParamGuard[];
}

/**
 * RouteConfig describes the navigation rules for a route:
 * @property routePattern - The route this config applies to
 * @property allowedPages - Which pages can access this route (with optional param guards)
 * @property allowedExternalUrls - External URLs allowed to access this route
 * @property defaultRedirect - Where to redirect if navigation is not allowed
 * @property sessionFlag - Optional session flag for additional checks
 */
export interface RouteConfig {
    routePattern: string;
    allowedPages: AllowedPageConfig[];
    allowedExternalUrls?: string[];
    defaultRedirect: string;
    sessionFlag?: string;
}

// --- Helper functions to reduce duplication ---

/** Common paramGuards */
const companyNumberGuard: ParamGuard = {
    paramName: constants.COMPANY_NUMBER,
    sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER
};
const userEmailGuard: ParamGuard = {
    paramName: constants.USER_EMAIL,
    sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL
};
const associationsIdGuard: ParamGuard = {
    paramName: constants.ASSOCIATIONS_ID,
    sessionKey: constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID
};

/**
 * Helper to generate AllowedPageConfig[] for a list of patterns with company number guard.
 */
function allowedPagesWithCompanyNumberGuard (patterns: string[]): AllowedPageConfig[] {
    return patterns.map(pattern => ({
        pattern: getFullUrl(pattern),
        paramGuards: [
            companyNumberGuard
        ]
    }));
}

/**
 * Helper to generate AllowedPageConfig[] for a list of patterns with user email guard.
 */
const allowedPagesWithUserEmailGuard = (patterns: string[]): AllowedPageConfig[] => {
    return patterns.map(pattern => ({
        pattern: getFullUrl(pattern),
        paramGuards: [
            userEmailGuard
        ]
    }));
};

/**
 * Helper to generate AllowedPageConfig[] for a list of patterns with associations id guard.
 */
const allowedPagesWithAssociationsIdGuard = (patterns: string[]): AllowedPageConfig[] => {
    return patterns.map(pattern => ({
        pattern: getFullUrl(pattern),
        paramGuards: [
            associationsIdGuard
        ]
    }));
};

/**
 * Helper to generate AllowedPageConfig[] for a list of patterns with both company number and user email guards.
 */
const allowedPagesWithCompanyNumberAndUserEmailGuard = (patterns: string[]): AllowedPageConfig[] => {
    return patterns.map(pattern => ({
        pattern: getFullUrl(pattern),
        paramGuards: [
            companyNumberGuard,
            userEmailGuard
        ]
    }));
};

/**
 * Helper to generate AllowedPageConfig[] for a list of patterns with no param guards.
 */
const allowedPagesNoGuards = (patterns: string[]): AllowedPageConfig[] => {
    return patterns.map(pattern => ({
        pattern: getFullUrl(pattern)
    }));
};

/**
 * Helper to generate AllowedPageConfig[] for a list of patterns with a custom param guard.
 */
const allowedPagesWithCustomGuard = (patterns: string[], paramGuards: ParamGuard[]): AllowedPageConfig[] => {
    return patterns.map(pattern => ({
        pattern: getFullUrl(pattern),
        paramGuards
    }));
};

// --- Centralized navigation configuration for all journeys ---

const MANAGE_AUTHORISED_PEOPLE_PREVIOUS_PAGES = [
    constants.MANAGE_AUTHORISED_PEOPLE_URL,
    constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
    constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
    constants.AUTHORISED_PERSON_ADDED_URL,
    constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
    constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL
];

const routeConfigs: RouteConfig[] = [
    // Add a company journey
    // 1) Confirm company details
    {
        routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
        allowedPages: [
            ...allowedPagesNoGuards([
                constants.CONFIRM_COMPANY_DETAILS_URL,
                constants.ADD_COMPANY_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2) Create company association
    {
        routePattern: constants.CREATE_COMPANY_ASSOCIATION_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.CREATE_COMPANY_ASSOCIATION_URL
            ]),
            ...allowedPagesNoGuards([
                constants.CONFIRM_COMPANY_DETAILS_URL
            ])
        ],
        allowedExternalUrls: [
            constants.ACCOUNT_URL
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 3) Company added success
    {
        routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
        allowedPages: [
            ...allowedPagesNoGuards([
                constants.COMPANY_ADDED_SUCCESS_URL,
                constants.CONFIRM_COMPANY_DETAILS_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard([
                constants.CREATE_COMPANY_ASSOCIATION_URL
            ])
        ],
        sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE,
        defaultRedirect: constants.LANDING_URL
    },

    // Remove company journey
    // 1) Remove company
    {
        routePattern: constants.REMOVE_COMPANY_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.REMOVE_COMPANY_URL
            ]),
            { pattern: constants.LANDING_URL }
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2) Remove company confirmed
    {
        routePattern: constants.REMOVE_COMPANY_CONFIRMED_URL,
        allowedPages: [
            ...allowedPagesNoGuards([
                constants.REMOVE_COMPANY_CONFIRMED_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard([
                constants.REMOVE_COMPANY_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // Remove authorisation do not restore journey
    // 1) Remove authorisation do not restore
    {
        routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL
            ]),
            { pattern: constants.LANDING_URL }
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2) Confirmation authorisation removed
    {
        routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
        allowedPages: [
            ...allowedPagesNoGuards([
                constants.CONFIRMATION_AUTHORISATION_REMOVED_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard([
                constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // Restore your digital authorisation journey
    // 1) Confirm company details for restoring digital authorisation
    {
        routePattern: constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL
            ]),
            { pattern: constants.LANDING_URL }
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2) Try restoring your digital authorisation
    {
        routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
                constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL
            ])
        ],
        allowedExternalUrls: [
            constants.ACCOUNT_URL
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 3) Restore your digital authorisation success
    {
        routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
        allowedPages: [
            ...allowedPagesNoGuards([
                constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard([
                constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
                constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL
            ])
        ],
        sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE,
        defaultRedirect: constants.LANDING_URL
    },

    // Accept/Reject company invitation journey
    // 2a) Accept invitation
    {
        routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
        allowedPages: [
            ...allowedPagesWithAssociationsIdGuard([
                constants.COMPANY_INVITATIONS_ACCEPT_URL
            ]),
            ...allowedPagesNoGuards([
                constants.COMPANY_INVITATIONS_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2b) Decline invitation
    {
        routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
        allowedPages: [
            ...allowedPagesWithAssociationsIdGuard([
                constants.COMPANY_INVITATIONS_DECLINE_URL
            ]),
            ...allowedPagesNoGuards([
                constants.COMPANY_INVITATIONS_URL
            ])
        ],
        defaultRedirect: getFullUrl(constants.COMPANY_INVITATIONS_URL)
    },

    // Manage authorised people journey with all sub-journeys

    // Add new authorised person journey
    // 1) Add presenter
    {
        routePattern: constants.ADD_PRESENTER_URL,
        allowedPages: [
            // itself and all possible previous steps
            ...allowedPagesWithCompanyNumberGuard([
                constants.ADD_PRESENTER_URL,
                ...MANAGE_AUTHORISED_PEOPLE_PREVIOUS_PAGES
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2) Check presenter
    {
        routePattern: constants.CHECK_PRESENTER_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.CHECK_PRESENTER_URL,
                constants.ADD_PRESENTER_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 3a) Authorised person added (alternative step)
    {
        routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.AUTHORISED_PERSON_ADDED_URL,
                constants.CHECK_PRESENTER_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 3b) Presenter already added (alternative step)
    {
        routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.PRESENTER_ALREADY_ADDED_URL,
                constants.CHECK_PRESENTER_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // Cancel a new authorised person journey
    // 1) Cancel person
    {
        routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberAndUserEmailGuard([
                constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard(MANAGE_AUTHORISED_PEOPLE_PREVIOUS_PAGES)
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2) Confirmation cancel person
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL
            ]),
            ...allowedPagesWithCustomGuard(
                [
                    constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL
                ],
                [
                    companyNumberGuard,
                    userEmailGuard
                ]
            )
        ],
        sessionFlag: constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE,
        defaultRedirect: constants.LANDING_URL
    },

    // Resend email to a new authorised person journey
    // 1) Manage authorised people email resent
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
        allowedPages: [
            ...allowedPagesWithUserEmailGuard([
                constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard(MANAGE_AUTHORISED_PEOPLE_PREVIOUS_PAGES)
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2) Confirmation email resent
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL
            ]),
            ...allowedPagesWithUserEmailGuard([
                constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard(MANAGE_AUTHORISED_PEOPLE_PREVIOUS_PAGES)
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // Restore digital authorisation for a user journey
    // 1) Send email invitation to be digitally authorised
    {
        routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
        allowedPages: [
            ...allowedPagesWithAssociationsIdGuard([
                constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard(MANAGE_AUTHORISED_PEOPLE_PREVIOUS_PAGES)
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 2) Confirmation digital authorisation restored
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL
            ]),
            ...allowedPagesWithAssociationsIdGuard([
                constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // Remove authorised person journey
    // 1) Authentication code remove
    {
        routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberAndUserEmailGuard([
                constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard(MANAGE_AUTHORISED_PEOPLE_PREVIOUS_PAGES)
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 3a) Removed themselves (alternative step)
    {
        routePattern: constants.REMOVED_THEMSELVES_URL,
        allowedPages: [
            ...allowedPagesNoGuards([
                constants.REMOVED_THEMSELVES_URL
            ]),
            ...allowedPagesWithCompanyNumberGuard([
                constants.MANAGE_AUTHORISED_PEOPLE_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    },

    // 3b) Confirmation person removed (alternative step)
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
        allowedPages: [
            ...allowedPagesWithCompanyNumberGuard([
                constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL
            ]),
            ...allowedPagesWithCompanyNumberAndUserEmailGuard([
                constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL
            ])
        ],
        defaultRedirect: constants.LANDING_URL
    }
];

export default routeConfigs;
