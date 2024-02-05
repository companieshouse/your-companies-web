/* eslint-disable import/first */

jest.mock("ioredis");
jest.mock("@companieshouse/web-security-node");

import app from "../../../src/app";
import mockSessionMiddleware from "../../mocks/session.middleware.mock";
import mockAuthenticationMiddleware from "../../mocks/authentication.middleware.mock";
import { authMiddleware, AuthOptions } from "@companieshouse/web-security-node";
import request from "supertest";
import { COMPANY_AUTH_PROTECTED_BASE, LANDING_URL } from "../../../src/constants";
import logger from "../../../src/lib/Logger";

// get handle on mocked function and create mock function to be returned from calling companyAuthMiddleware
const mockCompanyAuthMiddleware = authMiddleware as jest.Mock;
const mockLoggerErrorRequest = logger.errorRequest as jest.Mock;

// when the mocked companyAuthMiddleware is called, make it return a mocked function so we can verify it gets called
const mockAuthReturnedFunction = jest.fn();
mockAuthReturnedFunction.mockImplementation((_req, _res, next) => next());
mockCompanyAuthMiddleware.mockReturnValue(mockAuthReturnedFunction);

const URL = LANDING_URL + COMPANY_AUTH_PROTECTED_BASE.replace(":companyNumber", "12345678");

const expectedAuthMiddlewareConfig: AuthOptions = {
    chsWebUrl: "http://chsurl.co",
    returnUrl: URL,
    companyNumber: "12345678"
};

describe("company authentication middleware tests", () => {

    beforeEach(() => {
        mockCompanyAuthMiddleware.mockClear();
        mockSessionMiddleware.mockClear();
        mockAuthenticationMiddleware.mockClear();
    });

    it("should call CH authentication library when company pattern in url", async () => {
        await request(app).get(URL);

        expect(mockCompanyAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalled();
    });

    it("should call CH authentication library when company pattern in middle of url", async () => {
        const extraUrl = URL + "/extra";
        const originalReturnUrl = expectedAuthMiddlewareConfig.returnUrl;
        expectedAuthMiddlewareConfig.returnUrl = extraUrl;

        await request(app).get(extraUrl);

        expect(mockCompanyAuthMiddleware).toHaveBeenCalledWith(expectedAuthMiddlewareConfig);
        expect(mockAuthReturnedFunction).toHaveBeenCalled();

        expectedAuthMiddlewareConfig.returnUrl = originalReturnUrl;
    });

});
