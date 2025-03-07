// the order of the mock imports matter
import mocks from "../../../mocks/all.middleware.mock";
import {
    validActiveCompanyProfile
} from "../../../mocks/companyProfile.mock";
import { Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import app from "../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as commpanyProfileService from "../../../../src/services/companyProfileService";
import * as constants from "../../../../src/constants";
import { PROPOSED_COMPANY_NUM } from "../../../../src/constants";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import * as en from "../../../../locales/en/add-company.json";
import * as cy from "../../../../locales/cy/add-company.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import { Session } from "@companieshouse/node-session-handler";
import { getExtraData, setExtraData } from "../../../../src/lib/utils/sessionUtils";
import { getFullUrl } from "../../../../src/lib/utils/urlUtils";

const router = supertest(app);
const session: Session = new Session();

mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    next();
});

jest.mock("../../../../src/lib/Logger");
jest.mock("../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        setExtraData: jest.fn((session, key, value) => session.setExtraData(key, value)),
        getExtraData: jest.fn((session, key) => session.getExtraData(key))
    };
});

const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
const companyProfileSpy: jest.SpyInstance = jest.spyOn(commpanyProfileService, "getCompanyProfile");

describe("GET /your-companies/add-company", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        redirectPageSpy.mockReturnValue(false);
    });

    it("should check session and auth before returning the add company page", async () => {
        // When
        await router.get("/your-companies/add-company");
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        // Given
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and expected $langInfo content if language version set to English",
        async ({ langVersion, lang, langCommon }) => {
            // When
            const response = await router.get(`/your-companies/add-company${langVersion ? `?lang=${langVersion}` : ""}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(langCommon.back_link);
            expect(response.text).toContain(lang.what_is_the_company_number);
            expect(response.text).toContain(lang.a_company_number_is_8_characters_long);
            expect(response.text).toContain(lang.you_can_find_this_by_searching);
            expect(response.text).toContain(lang.how_do_i_find_the_company_number);
            expect(response.text).toContain(langCommon.continue);
        });

    it("should validate and display invalid input and error if input stored in session", async () => {
        // Given
        const expectedInput = "bad num";
        session.setExtraData(PROPOSED_COMPANY_NUM, expectedInput);
        companyProfileSpy.mockRejectedValue({
            httpStatusCode: StatusCodes.BAD_REQUEST
        } as Resource<CompanyProfile>);
        // When
        const response = await router.get("/your-companies/add-company?lang=en");
        // Then
        expect(response.text).toContain(expectedInput);
        expect(response.text).toContain("Enter a company number that is 8 characters long");
    });

    it("should not display input when cf=true is passed in url", async () => {
        // Given
        const expectedInput = "bad num";
        session.setExtraData(PROPOSED_COMPANY_NUM, expectedInput);
        // When
        const response = await router.get("/your-companies/add-company?cf=true");
        // Then
        expect(response.text).not.toContain(expectedInput);
        expect(response.text).not.toContain("Enter a company number that is 8 characters long");
    });

    it("should delete the page indicator in extraData on page load", async () => {
        // Given
        const CONFIRM_COMPANY_DETAILS_INDICATOR = "confirmCompanyDetailsIndicator";
        const value = true;
        setExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR, value);
        const data = getExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR);
        // When
        await router.get("/your-companies/add-company");
        const resultData = getExtraData(session, CONFIRM_COMPANY_DETAILS_INDICATOR);
        // Then
        expect(data).toBeTruthy();
        expect(resultData).toBeUndefined();
    });

    it("should handle saved profile scenario", async () => {
        // Given
        redirectPageSpy.mockReturnValue(false);
        companyProfileSpy.mockResolvedValue(validActiveCompanyProfile);
        const savedProfile = { companyNumber: "12345678" };
        setExtraData(session, constants.COMPANY_PROFILE, savedProfile);
        // When
        const response = await router.get("/your-companies/add-company");
        // Then
        expect(response.status).toBe(200);
        expect(response.text).toContain(savedProfile.companyNumber); // Check if saved profile company number is displayed
        expect(companyProfileSpy).toHaveBeenCalledWith(savedProfile.companyNumber);
    });

    it("should handle matching referrer URL scenario", async () => {
        // Given
        redirectPageSpy.mockReturnValue(false);
        companyProfileSpy.mockResolvedValue(validActiveCompanyProfile);
        setExtraData(session, constants.COMPANY_PROFILE, null); // Ensure no saved profile
        setExtraData(session, constants.CURRENT_COMPANY_NUM, "87654321");
        mocks.mockSessionMiddleware.mockImplementationOnce((req, res, next) => {
            req.session = session;
            req.headers = { referer: getFullUrl(constants.ADD_COMPANY_URL) };
            next();
        });
        // When
        const response = await router.get("/your-companies/add-company");
        // Then
        expect(response.status).toBe(200);
        expect(response.text).toContain("87654321"); // Check if current company number is displayed
        expect(companyProfileSpy).toHaveBeenCalledWith("87654321");
    });
});
