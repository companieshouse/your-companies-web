/* eslint-disable import/first */
jest.mock("ioredis");
jest.mock("@companieshouse/node-session-handler");

import { SessionMiddleware, EnsureSessionCookiePresentMiddleware, CookieConfig } from "@companieshouse/node-session-handler";
import { Request, Response } from "express";
import { sessionMiddleware, ensureSessionCookiePresentMiddleware } from "../../../src/middleware/session.middleware";
import { LANDING_URL, HEALTHCHECK_URL } from "../../../src/constants";

// get handle on mocked function and create mock function to be returned from calling sessionMiddleware
const mockSessionMiddleware = SessionMiddleware as jest.Mock;
const mockSessionReturnedFunction = jest.fn();

// get handle on mocked function and create mock function to be returned from calling EnsureSessionCookiePresentMiddleware
const mockEnsureSessionCookiePresentMiddleware = EnsureSessionCookiePresentMiddleware as jest.Mock;
const mockEnsureSessionCookiePresentReturnedFunction = jest.fn();

// when the mocked sessionMiddleware is called, make it return a mocked function so we can verify it gets called
mockSessionMiddleware.mockReturnValue(mockSessionReturnedFunction);

// when the mocked EnsureSessionCookiePresentMiddleware is called, make it return a mocked function so we can verify it gets called
mockEnsureSessionCookiePresentMiddleware.mockReturnValue(mockEnsureSessionCookiePresentReturnedFunction);

const URL = "/your-companies/something";
const req: Request = { originalUrl: URL } as Request;
const res: Response = {} as Response;
const next = jest.fn();

const expectedCookieConfig: CookieConfig = {
    cookieName: "cookie_name",
    cookieSecret: "123",
    cookieDomain: "cookie domain",
    cookieTimeToLiveInSeconds: 3600,
    cookieSecureFlag: true

};

describe("session middleware tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        req.originalUrl = URL;
    });

    it("should call CH session library", () => {
        sessionMiddleware(req, res, next);
        expect(mockSessionMiddleware).toHaveBeenCalledWith(expectedCookieConfig, expect.anything(), true);
        expect(mockSessionReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });

    it("should call next if url is on the whitelist", () => {
        req.originalUrl = LANDING_URL + HEALTHCHECK_URL;
        sessionMiddleware(req, res, next);
        expect(mockSessionMiddleware).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});

describe("ensure session cookie present middleware tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        req.originalUrl = URL;
    });

    it("should call CH ensure session cookie present library", () => {
        ensureSessionCookiePresentMiddleware(req, res, next);
        expect(mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalledWith(expectedCookieConfig);
        expect(mockEnsureSessionCookiePresentReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });

    it("should call next if url is on the whitelist", () => {
        req.originalUrl = LANDING_URL + HEALTHCHECK_URL;
        ensureSessionCookiePresentMiddleware(req, res, next);
        expect(mockEnsureSessionCookiePresentMiddleware).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
