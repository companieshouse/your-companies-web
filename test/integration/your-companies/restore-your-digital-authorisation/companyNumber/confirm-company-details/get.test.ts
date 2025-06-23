import mocks from "../../../../../mocks/all.middleware.mock";
import { Session } from "@companieshouse/node-session-handler";
import app from "../../../../../../src/app";
import supertest from "supertest";
import { NextFunction, Request, Response } from "express";
import { badFormatCompanyProfile, validActiveCompanyProfile } from "../../../../../mocks/companyProfile.mock";
import * as constants from "../../../../../../src/constants";
import en from "../../../../../../locales/en/confirm-company-details.json";
import cy from "../../../../../../locales/cy/confirm-company-details.json";
import * as companyProfileService from "../../../../../../src/services/companyProfileService";

const router = supertest(app);
const url = "/your-companies/restore-your-digital-authorisation/12345678/confirm-company-details";

const session: Session = new Session();

jest.mock("../../../../../../src/services/companyProfileService");
jest.mock("../../../../../../src/lib/utils/sessionUtils");
jest.mock("../../../../../../src/lib/Logger");
mocks.mockSessionMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
    req.session = session;
    return next();
});
const getCompanyProfileSpy: jest.SpyInstance = jest.spyOn(companyProfileService, "getCompanyProfile");

describe("GET /your-companies/restore-your-digital-authorisation/:companyNumber/confirm-company-details", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.data = { extra_data: {} };
    });

    it("should check session and auth before returning the your-companies page", async () => {
        getCompanyProfileSpy.mockReturnValue(validActiveCompanyProfile);
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "English", langVersion: undefined, lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return status 200 and expected $langInfo content if lang set to $langVersion",
        async ({ langVersion, lang }) => {
            // Given
            getCompanyProfileSpy.mockReturnValue(validActiveCompanyProfile);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.confirm_this_is_the_correct_company);
            expect(response.text).toContain(lang.company_name);
            expect(response.text).toContain(lang.company_number);
            expect(response.text).toContain(lang.status);
            expect(response.text).toContain(lang.incorporation_date);
            expect(response.text).toContain(lang.company_type);
            expect(response.text).toContain(lang.registered_office_address);
            expect(response.text).toContain(lang.confirm_and_continue);
            expect(response.text).toContain(lang.choose_a_different_company);
        });

    test.each([
        {
            langInfo: "English",
            langVersion: "en",
            expectedCompanyStatus: "Active",
            expectedCompanyType: "Private limited company",
            expectedDateOfCreation: "22 June 1972"
        },
        {
            langInfo: "Welsh",
            langVersion: "cy",
            expectedCompanyStatus: "Gweithredol",
            expectedCompanyType: "Cwmni preifat cyfyngedig",
            expectedDateOfCreation: "22 Mehefin 1972"
        }
    ])("should return formatted $langInfo company information from get profile request if lang set to '$langVersion'",
        async ({ langVersion, expectedCompanyStatus, expectedCompanyType, expectedDateOfCreation }) => {
            // Given
            getCompanyProfileSpy.mockReturnValue(badFormatCompanyProfile);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(expectedCompanyStatus);
            expect(response.text).toContain(expectedCompanyType);
            expect(response.text).toContain(expectedDateOfCreation);
        });

    const companyTypeTestData = [
        {
            type: "private-unlimited",
            expected: "Cwmni preifat anghyfynedig"
        },
        {
            type: "ltd",
            expected: "Cwmni preifat cyfyngedig"
        },
        {
            type: "plc",
            expected: "Cwmni cyfyngedig cyhoeddus"
        },
        {
            type: "old-public-company",
            expected: "Hen gwmni cyhoeddus"
        },
        {
            type: "limited-partnership",
            expected: "Partneriaeth gyfyngedig"
        },
        {
            type: "private-limited-guarant-nsc",
            expected: "Cwmni preifat cyfyngedig drwy warant heb gyfalaf cyfranddaliadau"
        },
        {
            type: "converted-or-closed",
            expected: "Cwmni wedi ei drosi/cau"
        },
        {
            type: "private-unlimited-nsc",
            expected: "Cwmni preifat anghyfyngedig heb gyfalaf cyfranddaliadau"
        },
        {
            type: "protected-cell-company",
            expected: "Cwmni Cell Warchodedig"
        },
        {
            type: "assurance-company",
            expected: "Cwmni aswiriant"
        },
        {
            type: "oversea-company",
            expected: "Cwmni tramor"
        }
    ];
    test.each(companyTypeTestData)("should display company types in Welsh - $type to $expected", async ({ type, expected }) => {
        // Given
        const badFormatCompanyProfileModified = { ...badFormatCompanyProfile };
        badFormatCompanyProfileModified.type = type;
        getCompanyProfileSpy.mockReturnValue(badFormatCompanyProfileModified);
        // When
        const response = await router.get(`${url}?lang=cy`);
        // Then
        expect(response.text).toContain(expected);
    });

    it("should return status 302 and correct response message including desired url path on page redirect", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        mocks.mockNavigationMiddleware.mockImplementation((req: Request, res: Response) => {
            res.redirect(urlPath);
        });
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

});
