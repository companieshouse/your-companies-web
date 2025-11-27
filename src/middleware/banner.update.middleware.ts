/**
 * Improved Express middleware to fetch banner content.
 *
 * Improvements made:
 * - Fix typo: bannerActice -> bannerActive
 * - Add robust error handling (won't crash the request pipeline)
 * - Add small in-memory cache with TTL to avoid calling the API on every request
 * - Use single-flight (pending promise) to prevent multiple concurrent API calls
 * - Add explicit types for the banner data and extend Express' Locals for type-safety
 * - Keep behavior predictable: if the API fails, middleware continues without a banner
 *
 * Considerations:
 * - In-memory cache is per-process. For multi-instance deployments use Redis or another shared cache.
 * - Adjust TTL to fit your freshness/performance tradeoff.
 */

import type { Request, Response, NextFunction } from "express";

/** Replace this with the real type returned by getBannerContentApiResponse */
interface BannerData {
  active: boolean;
  // add other banner properties here, e.g. message, cta, imageUrl, etc.
  [key: string]: any;
}

// If you want typed res.locals across your app, extend Express' Locals:
declare global {
  namespace Express {
    interface Locals {
      cmsBanner?: BannerData | null;
      bannerActive?: boolean;
    }
  }
}

// Replace with actual import
// import { getBannerContentApiResponse } from "./path/to/api";
async function getBannerContentApiResponse(): Promise<BannerData> {
    // placeholder - replace with the real implementation
    return { active: false };
}

/**
 * Factory that creates the middleware with its own cache and TTL.
 * Using a factory allows configuring TTL, logger, etc. in one place.
 */
export function createCmsMiddleware(options?: { ttlMs?: number; logger?: Console }) {
    const ttlMs = options?.ttlMs ?? 60 * 1000; // default 60s
    const logger = options?.logger ?? console;

    // simple in-memory cache
    let cached: { data: BannerData; expiresAt: number } | null = null;
    // single-flight pending request to avoid N concurrent calls
    let pendingFetch: Promise<BannerData> | null = null;

    async function fetchAndCache(): Promise<BannerData> {
        try {
            const data = await getBannerContentApiResponse();
            cached = { data, expiresAt: Date.now() + ttlMs };
            return data;
        } finally {
            // clear pendingFetch in the caller (see below) to keep logic simple
        }
    }

    // The actual middleware
    return async function cmsMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const now = Date.now();

            if (cached && cached.expiresAt > now) {
                // cache hit
                const data = cached.data;
                res.locals.cmsBanner = data;
                res.locals.bannerActive = Boolean(data?.active);
                return next();
            }

            // if a fetch is already in progress, wait for it
            if (!pendingFetch) {
                pendingFetch = (async () => {
                    try {
                        return await fetchAndCache();
                    } finally {
                        // ensure pendingFetch is cleared so subsequent requests can trigger a refresh when needed
                        pendingFetch = null;
                    }
                })();
            }

            const data = await pendingFetch;

            // protect against undefined/malformed API response
            if (data && typeof data === "object") {
                res.locals.cmsBanner = data;
                res.locals.bannerActive = Boolean(data.active);
            } else {
                res.locals.cmsBanner = null;
                res.locals.bannerActive = false;
                logger.warn("cmsMiddleware: banner API returned no data or unexpected shape");
            }

            next();
        } catch (err) {
            // Don't block requests if the CMS call fails; log and continue without banner.
            logger.error("cmsMiddleware: failed to fetch banner content", err);
            res.locals.cmsBanner = null;
            res.locals.bannerActive = false;
            next();
        }
    };
}

// Default exported middleware (with default TTL). Use this for easy import.
export const cmsMiddleware = createCmsMiddleware();
