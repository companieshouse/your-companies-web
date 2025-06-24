import { Request, Response, NextFunction } from "express";
import * as url from "node:url";
import * as constants from "../constants";
import { deleteExtraData, getExtraData } from "../lib/utils/sessionUtils";
import { getFullUrl } from "../lib/utils/urlUtils";
import { Session } from "@companieshouse/node-session-handler";

interface AllowedPageConfig {
    pattern: string;
    paramGuards?: Array<{ paramName: string; sessionKey: string }>;
}

interface RouteConfig {
    routePattern: string;
    allowedPages: AllowedPageConfig[];
    allowedExternalUrls?: string[];
    defaultRedirect: string;
    sessionFlag?: string;
}

// Centralized config with route patterns
const routeConfig: RouteConfig[] = [
    {
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
    },
    {
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
            }
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
            }
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
            }
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
        allowedPages: [
            { pattern: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL) }, // itself
            { pattern: getFullUrl(constants.ADD_COMPANY_URL) } // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
        allowedPages: [
            { pattern: getFullUrl(constants.COMPANY_ADDED_SUCCESS_URL) }, // itself
            { pattern: getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL) } // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
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
            }
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
            }
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
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
    },
    {
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
    }
];

// Helper to match a path against a pattern with :param support
const matchPathToPattern = (path: string, pattern: string): boolean => {
    const pathSegments = path.split("/").filter(Boolean);
    const patternSegments = pattern.split("/").filter(Boolean);

    if (pathSegments.length !== patternSegments.length) return false;

    for (let i = 0; i < patternSegments.length; i++) {
        if (patternSegments[i].startsWith(":")) continue; // treat as wildcard
        if (patternSegments[i] !== pathSegments[i]) return false;
    }
    return true;
};

// Helper to extract params from a path given a pattern
const extractParams = (path: string, pattern: string): Record<string, string> => {
    const pathSegments = path.split("/").filter(Boolean);
    const patternSegments = pattern.split("/").filter(Boolean);
    const params: Record<string, string> = {};

    for (let i = 0; i < patternSegments.length; i++) {
        if (patternSegments[i].startsWith(":")) {
            params[patternSegments[i].slice(1)] = pathSegments[i];
        }
    }
    return params;
};

// Helper for parameter guards (supports single value or array)
const areParamsValid = (
    params: Record<string, string>,
    paramGuards: Array<{ paramName: string; sessionKey: string }> | undefined,
    session: Session | undefined
): boolean => {
    if (!paramGuards) return true;
    return paramGuards.every(guard => {
        const paramValue = params[guard.paramName];
        const sessionValue = getExtraData(session, guard.sessionKey);
        if (Array.isArray(sessionValue)) {
            return sessionValue.includes(paramValue);
        }
        return paramValue === sessionValue;
    });
};

// Find config for current path
const findConfigForPath = (path: string): RouteConfig | undefined => {
    return routeConfig.find(cfg => matchPathToPattern(path, cfg.routePattern));
};

export const navigationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const config = findConfigForPath(req.path.substring(constants.LANDING_URL.length));

    if (!config) return next();

    const currentPath = req.baseUrl + req.path;
    const referer = req.headers.referer as string | undefined;
    const refererPath = referer ? url.parse(referer, true).pathname || "" : "";

    // Params for current path
    const currentParams = req.params;

    // Params for referer path (if any match)
    let refererParams: Record<string, string> | undefined;
    let refererParamGuards: Array<{ paramName: string; sessionKey: string }> | undefined;
    if (refererPath) {
        for (const allowed of config.allowedPages) {
            if (matchPathToPattern(refererPath, allowed.pattern)) {
                refererParams = extractParams(refererPath, allowed.pattern);
                refererParamGuards = allowed.paramGuards;
                break;
            }
        }
    }

    // Allow reloads/language switches (referer is self)
    if (refererPath === currentPath) {
        if (!areParamsValid(currentParams, refererParamGuards, req.session)) {
            return res.redirect(config.defaultRedirect);
        }
        return next();
    }

    // Session flag for external service
    if (config.sessionFlag) {
        const sessionFlag = getExtraData(req.session, config.sessionFlag);
        if (sessionFlag) {
            if (!areParamsValid(currentParams, refererParamGuards, req.session)) {
                return res.redirect(config.defaultRedirect);
            }
            deleteExtraData(req.session, config.sessionFlag);
            return next();
        }
        return res.redirect(config.defaultRedirect);
    }

    // Entry points
    if (config.allowedPages.length === 0) {
        return next();
    }

    // Check referer against allowed external URLs
    if (config.allowedExternalUrls?.some(externalUrl => referer?.startsWith(externalUrl))) {
        return next();
    }

    // Check referer path against all patterns and validate referer params
    if (
        refererPath &&
        refererParams &&
        config.allowedPages.some(allowed => matchPathToPattern(refererPath, allowed.pattern))
    ) {
        if (!areParamsValid(refererParams, refererParamGuards, req.session)) {
            return res.redirect(config.defaultRedirect);
        }
        return next();
    }

    // Fallback: check current params as last resort
    if (!areParamsValid(currentParams, refererParamGuards, req.session)) {
        return res.redirect(config.defaultRedirect);
    }

    return res.redirect(config.defaultRedirect);
};
