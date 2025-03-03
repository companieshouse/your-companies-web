/* eslint-disable import/first */

jest.mock("@companieshouse/web-security-node");

import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { authenticationMiddleware } from "../../../../src/middleware/authentication.middleware";
import { LANDING_URL, HEALTHCHECK_URL } from "../../../../src/constants";

// get handle on mocked function and create mock function to be returned from calling authMiddleware
const mockAuthMiddleware = authMiddleware as jest.Mock;
const mockAuthReturnedFunction = jest.fn();

// when the mocked authMiddleware is called, make it return a mocked function so we can verify it gets called
mockAuthMiddleware.mockReturnValue(mockAuthReturnedFunction);

const URL = "/your-companies/something";
const req: Request = { originalUrl: URL } as Request;
const res: Response = {} as Response;
const next = jest.fn();

const expectedAuthMiddlewareConfig: AuthOptions = {
    chsWebUrl: "http://chsurl.co",
    returnUrl: URL
};

describe("authentication middleware tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        req.originalUrl = URL;
    });

    it("should call CH authentication library", () => {
        authenticationMiddleware(req, res, next);
        expect(mockAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });

    it("should not redirect to sign in when url is on whitelist", () => {
        req.originalUrl = LANDING_URL + HEALTHCHECK_URL;
        authenticationMiddleware(req, res, next);
        expect(mockAuthMiddleware).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
