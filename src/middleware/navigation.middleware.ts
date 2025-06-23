import { Request, Response, NextFunction } from "express";
import * as url from "node:url";
import * as constants from "../constants";
import { deleteExtraData, getExtraData } from "../lib/utils/sessionUtils";
import { getFullUrl } from "../lib/utils/urlUtils";

interface RouteConfig {
    routePattern: string;
    allowedPages: string[];
    allowedExternalUrls?: string[];
    defaultRedirect: string;
    sessionFlag?: string;
    paramGuards?: Array<{ paramName: string; sessionKey: string }>;
}

// Centralized config with route patterns
const routeConfig: RouteConfig[] = [
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL,
        allowedPages: [
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_CANCEL_PERSON_URL), // itself
            getFullUrl(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL,
        allowedPages: [
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL), // itself
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
        allowedPages: [
            getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL), // itself
            getFullUrl(constants.CHECK_PRESENTER_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
        allowedPages: [
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL), // itself
            getFullUrl(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL,
        allowedPages: [
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL), // itself
            getFullUrl(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
        allowedPages: [
            getFullUrl(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL), // itself
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.REMOVED_THEMSELVES_URL,
        allowedPages: [
            getFullUrl(constants.REMOVED_THEMSELVES_URL), // itself
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.REMOVE_COMPANY_URL,
        allowedPages: [
            getFullUrl(constants.REMOVE_COMPANY_URL), // itself
            constants.LANDING_URL // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.REMOVE_COMPANY_CONFIRMED_URL,
        allowedPages: [
            getFullUrl(constants.REMOVE_COMPANY_CONFIRMED_URL), // itself
            getFullUrl(constants.REMOVE_COMPANY_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
        allowedPages: [
            getFullUrl(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL), // itself
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
        allowedPages: [
            getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL), // itself
            getFullUrl(constants.ADD_COMPANY_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
        allowedPages: [
            getFullUrl(constants.COMPANY_ADDED_SUCCESS_URL), // itself
            getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.ADD_PRESENTER_URL,
        allowedPages: [
            getFullUrl(constants.ADD_PRESENTER_URL), // itself
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.CHECK_PRESENTER_URL,
        allowedPages: [
            getFullUrl(constants.CHECK_PRESENTER_URL), // itself
            getFullUrl(constants.ADD_PRESENTER_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
        allowedPages: [
            getFullUrl(constants.COMPANY_INVITATIONS_DECLINE_URL), // itself
            getFullUrl(constants.COMPANY_INVITATIONS_URL) // page prior to it
        ],
        defaultRedirect: getFullUrl(constants.COMPANY_INVITATIONS_URL)
    },
    {
        routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
        allowedPages: [
            getFullUrl(constants.COMPANY_INVITATIONS_ACCEPT_URL), // itself
            getFullUrl(constants.COMPANY_INVITATIONS_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
        allowedPages: [
            getFullUrl(constants.PRESENTER_ALREADY_ADDED_URL), // itself
            getFullUrl(constants.CHECK_PRESENTER_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL,
        allowedPages: [
            getFullUrl(constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL), // itself
            getFullUrl(constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL) // page prior to it
        ],
        allowedExternalUrls: [
            constants.ACCOUNT_URL
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL,
        allowedPages: [
            getFullUrl(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL), // itself
            getFullUrl(constants.TRY_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL), // page prior to it
            getFullUrl(constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL,
        allowedPages: [
            getFullUrl(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_URL), // itself
            getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL) // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL,
        allowedPages: [
            getFullUrl(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL), // itself
            constants.LANDING_URL // page prior to it
        ],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.CONFIRMATION_AUTHORISATION_REMOVED_URL,
        allowedPages: [
            getFullUrl(constants.CONFIRMATION_AUTHORISATION_REMOVED_URL), // itself
            getFullUrl(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL) // page prior to it
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

// Helper for parameter guards (supports single value or array)
const areParamsValid = (req: Request, config: typeof routeConfig[number]): boolean => {
    if (!config.paramGuards) return true;
    return config.paramGuards.every(guard => {
        const paramValue = req.params[guard.paramName];
        const sessionValue = getExtraData(req.session, guard.sessionKey);
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
    const config = findConfigForPath(req.path);

    if (!config) return next();

    const currentPath = req.baseUrl + req.path;
    const referer = req.headers.referer as string | undefined;
    const refererPath = referer ? url.parse(referer, true).path || "" : "";

    // Allow reloads/language switches (referer is self)
    if (refererPath === currentPath) {
        if (!areParamsValid(req, config)) {
            return res.redirect(config.defaultRedirect);
        }
        return next();
    }

    // Session flag for external service
    if (config.sessionFlag) {
        const sessionFlag = getExtraData(req.session, config.sessionFlag);
        if (sessionFlag) {
            if (!areParamsValid(req, config)) {
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

    // Check referer agains allowed external URLs
    if (config.allowedExternalUrls?.some(externalUrl => referer?.startsWith(externalUrl))) {
        return next();
    }

    // Check referer path against all patterns
    if (
        refererPath &&
        config.allowedPages.some(pattern =>
            matchPathToPattern(refererPath, pattern)
        )
    ) {
        if (!areParamsValid(req, config)) {
            return res.redirect(config.defaultRedirect);
        }
        return next();
    }

    return res.redirect(config.defaultRedirect);
};
