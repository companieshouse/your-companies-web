/* eslint-disable import/first */

jest.mock("ioredis");
jest.mock("@companieshouse/web-security-node");

import { mockEnsureSessionCookiePresentMiddleware, mockSessionMiddleware } from "../../mocks/session.middleware.mock";
import mockCsrfProtectionMiddleware from "../../mocks/csrf.protection.middleware.mock";
import mockAuthenticationMiddleware from "../../mocks/authentication.middleware.mock";
import { authMiddleware } from "@companieshouse/web-security-node";
import request from "supertest";
import app from "../../../src/app";
import * as constants from "../../../src/constants";

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
    });

    it("should call CH company authentication library when removing an authorised person", async () => {
        const URL = constants.YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL.replace(":companyNumber", "12345678");
        await request(app).get(URL);

        expect(mockCompanyAuthMiddleware).toHaveBeenCalledWith({
            chsWebUrl: "http://chsurl.co",
            returnUrl: URL,
            companyNumber: "12345678"
        });
        expect(mockAuthReturnedFunction).toHaveBeenCalled();
        expect(mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });

    it("should call CH company authentication library when cancelling an authorised person", async () => {
        const URL = constants.YOUR_COMPANIES_COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL.replace(":companyNumber", "12345678");

        await request(app).get(URL);

        expect(mockCompanyAuthMiddleware).toHaveBeenCalledWith({
            chsWebUrl: "http://chsurl.co",
            returnUrl: URL,
            companyNumber: "12345678"
        });
        expect(mockAuthReturnedFunction).toHaveBeenCalled();
        expect(mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });
});
