import mocks from "../../../../../mocks/all.middleware.mock";
import { Session } from "@companieshouse/node-session-handler";
import app from "../../../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import { validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import * as sessionUtils from "../../../../../../src/lib/utils/sessionUtils";
import * as urlUtils from "../../../../../../src/lib/utils/urlUtils";

const router = supertest(app);
const url = "/your-companies/restore-your-digital-authorisation/12345678/confirm-company-details";

const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});

jest.mock("../../../../../../src/lib/Logger");
jest.mock("../../../../../../src/lib/utils/sessionUtils");

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
const getTryRestoringYourDigitalAuthorisationFullUrlSpy: jest.SpyInstance = jest.spyOn(urlUtils, "getTryRestoringYourDigitalAuthorisationFullUrl");

describe("POST /your-companies/restore-your-digital-authorisation/:companyNumber/confirm-company-details", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(validActiveCompanyProfile);
        // When
        await router.post(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("redirects to try restoring your digital authorisation controller with company number param in url", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(validActiveCompanyProfile);
        const redirectUrl = "/your-companies/company/12345678/try-restoring-your-digital-authorisation";
        getTryRestoringYourDigitalAuthorisationFullUrlSpy.mockReturnValue(redirectUrl);
        // When
        const resp = await router.post(url);
        // Then
        expect(resp.status).toEqual(302);
        expect(resp.header.location).toEqual(redirectUrl);
    });
});
