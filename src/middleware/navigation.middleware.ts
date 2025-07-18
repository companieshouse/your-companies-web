import { Request, Response, NextFunction } from "express";
import * as url from "node:url";
import { deleteExtraData, getExtraData } from "../lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import routeConfigs, { ParamGuard, RouteConfig } from "./navigation.middleware.config";
import logger, { createLogMessage } from "../lib/Logger";

/**
 * Checks if a given path matches a pattern with support for :param wildcards.
 * @param path - The actual URL path (e.g., "/foo/123/bar")
 * @param pattern - The pattern to match against (e.g., "/foo/:id/bar")
 * @returns True if the path matches the pattern, false otherwise.
 */
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

/**
 * Extracts parameter values from a path based on a pattern with :param wildcards.
 * @param path - The actual URL path (e.g., "/foo/123/bar")
 * @param pattern - The pattern to extract params from (e.g., "/foo/:id/bar")
 * @returns An object mapping param names to values (e.g., { id: "123" })
 */
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

/**
 * Validates that route parameters match expected values from the session.
 * Supports single values or arrays in the session.
 * @param params - The extracted route parameters.
 * @param paramGuards - Array of guards specifying which params to check against session keys.
 * @param session - The current session object.
 * @returns True if all param guards pass, false otherwise.
 */
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

/**
 * Finds the route configuration for a given path.
 * @param path - The request path.
 * @returns The matching RouteConfig, or undefined if not found.
 */
const findConfigForPath = (path: string): RouteConfig | undefined => {
    return routeConfigs.find(cfg => matchPathToPattern(path, cfg.routePattern));
};

/**
 * Extracts the pathname from the Referer header of the given HTTP request.
 *
 * @param req - The HTTP request object from which to extract the Referer header.
 * @returns The pathname portion of the Referer URL, or an empty string if not available.
 */
const getRefererPath = (req: Request): string => {
    const referer = req.headers.referer;
    return referer ? url.parse(referer, true).pathname ?? "" : "";
};

/**
 * Extracts parameters and parameter guards from the referer path based on allowed route configurations.
 *
 * Iterates through the provided allowedPages and checks if the refererPath matches any of the route patterns.
 * If a match is found, it extracts the route parameters and associated parameter guards.
 *
 * @param refererPath - The path of the referer to be checked against allowed route patterns.
 * @param allowedPages - An array of route configurations specifying allowed patterns and parameter guards.
 * @returns An object containing the extracted referer parameters (`refererParams`)
 * and parameter guards (`refererParamGuards`) if a match is found; otherwise, returns an empty object.
 */
const getRefererParamsAndGuards = (
    refererPath: string,
    allowedPages: RouteConfig["allowedPages"]
): { refererParams?: Record<string, string>; refererParamGuards?: ParamGuard[] } => {
    for (const allowed of allowedPages) {
        if (matchPathToPattern(refererPath, allowed.pattern)) {
            return {
                refererParams: extractParams(refererPath, allowed.pattern),
                refererParamGuards: allowed.paramGuards
            };
        }
    }
    return {};
};

/**
 * Determines whether the provided referer URL is allowed based on a list of permitted external URLs.
 *
 * @param referer - The referer URL to check, or undefined if not provided.
 * @param allowedExternalUrls - An optional array of allowed external URL prefixes.
 * @returns True if the referer starts with any of the allowed external URLs; otherwise, false.
 */
const isAllowedExternalReferer = (
    referer: string | undefined,
    allowedExternalUrls?: string[]
): boolean => {
    return !!allowedExternalUrls?.some(externalUrl => referer?.startsWith(externalUrl));
};

/**
 * Handles navigation based on a session flag specified in the route configuration.
 * If the session flag exists in the session, it is deleted and navigation is allowed.
 * If the session flag does not exist, the user is redirected to the default redirect URL.
 * If no session flag is specified in the configuration, the function returns `undefined`.
 *
 * @param req - The Express request object, containing the session.
 * @param res - The Express response object, used for redirection.
 * @param config - The route configuration object, which may specify a session flag and a default redirect URL.
 * @returns `true` if navigation is allowed, `false` if a redirect occurs, or `undefined` if not applicable.
 */
const handleSessionFlag = (
    req: Request,
    res: Response,
    config: RouteConfig
): boolean => {
    if (config.sessionFlag) {
        const sessionFlag = getExtraData(req.session, config.sessionFlag);
        if (sessionFlag) {
            deleteExtraData(req.session, config.sessionFlag);
            return true; // allow navigation
        }
        logger.error(createLogMessage(
            req.session,
            navigationMiddleware.name,
            `${req.path} requires a session flag ${JSON.stringify(config.sessionFlag)} with value 'true' but got ${JSON.stringify(sessionFlag)} instead - redirecting to the default page`
        ));
        res.redirect(config.defaultRedirect);
        return false; // redirect
    }
    return undefined as unknown as boolean; // not applicable
};

/**
 * Middleware to handle navigation flow and access control based on the request path, referer, and session state.
 *
 * This middleware checks if the current request path matches a configured navigation rule.
 * It validates navigation based on allowed pages, referer, session flags, and external URLs.
 * If navigation is not allowed, it redirects to a default path.
 *
 * @param req - Express request object, expected to contain path, params, headers, and session.
 * @param res - Express response object, used for redirection if navigation is not allowed.
 * @param next - Express next middleware function, called if navigation is allowed.
 * @returns A Promise that resolves when navigation is handled or redirected.
 */
export const navigationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const config = findConfigForPath(req.path);
    if (!config) {
        logger.info(createLogMessage(
            req.session,
            navigationMiddleware.name,
            `${req.path} has no navigation middleware config - calling next()`
        ));
        return next();
    }

    const currentPath = req.baseUrl + req.path;
    const refererPath = getRefererPath(req);
    const referer = req.headers.referer;
    const currentParams = req.params;

    const { refererParams, refererParamGuards } = getRefererParamsAndGuards(refererPath, config.allowedPages);

    // Allow reloads/language switches (referer is self)
    if (refererPath === currentPath) {
        if (!areParamsValid(currentParams, refererParamGuards, req.session)) {
            logger.error(createLogMessage(
                req.session,
                navigationMiddleware.name,
                `${req.path} has invalid parameters: ${JSON.stringify(currentParams)} - redirecting to the default page`
            ));
            return res.redirect(config.defaultRedirect);
        }
        return next();
    }

    // Session flag for external service
    const sessionFlagResult = handleSessionFlag(req, res, config);
    if (sessionFlagResult !== undefined) {
        if (sessionFlagResult) return next();
        return; // already redirected
    }

    // Check referer against allowed external URLs
    if (isAllowedExternalReferer(referer, config.allowedExternalUrls)) {
        return next();
    }

    // Check referer path against all patterns and validate referer params
    if (
        refererPath &&
        refererParams &&
        config.allowedPages.some(allowed => matchPathToPattern(refererPath, allowed.pattern))
    ) {
        if (!areParamsValid(refererParams, refererParamGuards, req.session)) {
            logger.error(createLogMessage(
                req.session,
                navigationMiddleware.name,
                `${req.path} has invalid parameters: ${JSON.stringify(currentParams)} - redirecting to the default page`
            ));
            return res.redirect(config.defaultRedirect);
        }
        return next();
    }

    logger.error(createLogMessage(
        req.session,
        navigationMiddleware.name,
        `DEBUG: 
        req.path=${req.path}, 
        req.baseUrl=${req.baseUrl}, 
        currentPath=${currentPath}, 
        referer=${referer}, 
        refererPath=${refererPath}, 
        currentParams=${JSON.stringify(currentParams)}, 
        refererParams=${JSON.stringify(refererParams)}, 
        refererParamGuards=${JSON.stringify(refererParamGuards)}, 
        config.routePattern=${config.routePattern}, 
        config.allowedPages=${JSON.stringify(config.allowedPages)}, 
        config.allowedExternalUrls=${JSON.stringify(config.allowedExternalUrls)}, 
        config.sessionFlag=${config.sessionFlag}, 
        sessionFlagValue=${config.sessionFlag ? JSON.stringify(getExtraData(req.session, config.sessionFlag)) : undefined}, 
        isAllowedExternalReferer=${isAllowedExternalReferer(referer, config.allowedExternalUrls)}`
    ));
    return res.redirect(config.defaultRedirect);
};
