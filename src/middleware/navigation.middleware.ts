import { Request, Response, NextFunction } from "express";
import * as url from "node:url";
import { deleteExtraData, getExtraData } from "../lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import routeConfig, { RouteConfig } from "./navigation.middleware.config";

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

export const navigationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const config = findConfigForPath(req.path);

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
