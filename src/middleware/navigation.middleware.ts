import { Request, Response, NextFunction } from "express";
import * as url from "node:url";
import * as constants from "../constants";
import { deleteExtraData, getExtraData } from "../lib/utils/sessionUtils";
import { getFullUrl } from "../lib/utils/urlUtils";

interface RouteConfig {
    routePattern: string;
    allowedPages: string[];
    defaultRedirect: string;
    sessionFlag?: string;
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
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.AUTHORISED_PERSON_ADDED_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.REMOVED_THEMSELVES_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.REMOVE_COMPANY_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.REMOVE_COMPANY_CONFIRMED_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.CONFIRM_COMPANY_DETAILS_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_ADDED_SUCCESS_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.ADD_PRESENTER_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.CHECK_PRESENTER_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_INVITATIONS_DECLINE_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.COMPANY_INVITATIONS_ACCEPT_URL,
        allowedPages: [],
        defaultRedirect: constants.LANDING_URL
    },
    {
        routePattern: constants.PRESENTER_ALREADY_ADDED_URL,
        allowedPages: [],
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
        return next();
    }

    // Session flag for external service
    if (config.sessionFlag) {
        const sessionFlag = getExtraData(req.session, config.sessionFlag);
        if (sessionFlag) {
            deleteExtraData(req.session, config.sessionFlag);
            return next();
        }
        return res.redirect(config.defaultRedirect);
    }

    // Entry points
    if (config.allowedPages.length === 0) {
        return next();
    }

    // Check referer path against all patterns
    if (
        refererPath &&
        config.allowedPages.some(pattern =>
            matchPathToPattern(refererPath, pattern)
        )
    ) {
        return next();
    }

    return res.redirect(config.defaultRedirect);
};
