/* eslint-disable import/first */
jest.mock("@companieshouse/web-security-node");
jest.mock("ioredis");

import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";
import { Request, Response } from "express";
import { csrfProtectionMiddleware } from "../../../../src/middleware/csrf.protection.middleware";
import * as constants from "../../../../src/constants";

const mockCsrfMiddleware = CsrfProtectionMiddleware as jest.Mock;
const mockCsrfReturnedFunction = jest.fn();

mockCsrfMiddleware.mockReturnValue(mockCsrfReturnedFunction);

const URL = "/authorised-agent/something";
const req: Request = { originalUrl: URL } as Request;
const res: Response = {} as Response;
const next = jest.fn();

describe("Csrf middleware tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        req.originalUrl = URL;
    });

    it("should call web security node csrfProtectionMiddleware middleware", () => {
        csrfProtectionMiddleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(mockCsrfMiddleware).toHaveBeenCalled();
        expect(mockCsrfReturnedFunction).toHaveBeenCalledWith(req, res, next);
    });

    it("should not call csrf middleware function when url is in whitelist", () => {
        req.originalUrl = constants.LANDING_URL + constants.HEALTHCHECK_URL;
        csrfProtectionMiddleware(req, res, next);
        expect(mockCsrfMiddleware).not.toHaveBeenCalled();
        expect(mockCsrfReturnedFunction).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
