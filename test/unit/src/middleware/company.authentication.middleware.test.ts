/* eslint-disable import/first */

jest.mock("ioredis");
jest.mock("@companieshouse/web-security-node");

import { mockEnsureSessionCookiePresentMiddleware, mockSessionMiddleware } from "../../../mocks/session.middleware.mock";
import mockCsrfProtectionMiddleware from "../../../mocks/csrf.protection.middleware.mock";
import mockAuthenticationMiddleware from "../../../mocks/authentication.middleware.mock";
import mockNavigationMiddleware from "../../../mocks/navigation.middleware.mock";
import { authMiddleware } from "@companieshouse/web-security-node";
import request from "supertest";
import app from "../../../../src/app";
import * as constants from "../../../../src/constants";
import { getFullUrl } from "../../../../src/lib/utils/urlUtils";
import { companyAuthenticationMiddlewareCheckboxDisabled } from "../../../../src/middleware/company.authentication";
import { NextFunction, Request, Response } from "express";
import { Session } from "@companieshouse/node-session-handler";

// get handle on mocked function and create mock function to be returned from calling companyAuthMiddleware
const mockCompanyAuthMiddleware = authMiddleware as jest.Mock;

// when the mocked companyAuthMiddleware is called, make it return a mocked function so we can verify it gets called
const mockAuthReturnedFunction = jest.fn();
mockAuthReturnedFunction.mockImplementation((_req, _res, next) => next());
mockCompanyAuthMiddleware.mockReturnValue(mockAuthReturnedFunction);

describe("company authentication middleware tests", () => {

    beforeEach(() => {
        mockCompanyAuthMiddleware.mockClear();
        mockSessionMiddleware.mockClear();
        mockEnsureSessionCookiePresentMiddleware.mockClear();
        mockCsrfProtectionMiddleware.mockClear();
        mockAuthenticationMiddleware.mockClear();
        mockNavigationMiddleware.mockClear();

    });

    it("should call CH company authentication library when removing an authorised person", async () => {
        const URL = getFullUrl(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL).replace(":companyNumber", "12345678");

        await request(app).get(URL);

        expect(mockCompanyAuthMiddleware).toHaveBeenCalledWith({
            chsWebUrl: "http://chsurl.co",
            returnUrl: URL,
            companyNumber: "12345678",
            disableSaveCompanyCheckbox: true
        });
        expect(mockAuthReturnedFunction).toHaveBeenCalled();
        expect(mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });
});
describe("Company Authentication Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            params: {
                [constants.COMPANY_NUMBER]: "12345678"
            },
            originalUrl: "/test-url",
            session: new Session()
        };
        mockRes = {};
        mockNext = jest.fn();
        (authMiddleware as jest.Mock).mockReturnValue(() => "mock-auth-result");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("exported company auth middleware instances", () => {
        it("CompanyAuthenticationMiddlewareCheckboxDisabled should use disableSaveCompanyCheckbox=true", () => {
            companyAuthenticationMiddlewareCheckboxDisabled(mockReq as Request, mockRes as Response, mockNext);

            expect(authMiddleware).toHaveBeenCalledWith(expect.objectContaining({
                disableSaveCompanyCheckbox: true,
                chsWebUrl: constants.CHS_URL,
                returnUrl: "/test-url",
                companyNumber: "12345678"
            }));
        });
    });

});
