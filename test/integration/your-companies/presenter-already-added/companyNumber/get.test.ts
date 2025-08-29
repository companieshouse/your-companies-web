import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../../src/constants";
import en from "../../../../../locales/en/presenter-already-added.json";
import cy from "../../../../../locales/cy/presenter-already-added.json";
import enCommon from "../../../../../locales/en/common.json";
import cyCommon from "../../../../../locales/cy/common.json";
import { when } from "jest-when";
import { Request, Response } from "express";

const router = supertest(app);

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com"),
        getExtraData: jest.fn()
    };
});

describe("GET /your-companies/presenter-already-added/:companyNumber", () => {
    const companyNumber = "AB123456";
    const companyName = "ABC Ltd.";
    const userEmail = "john.smith@test.com";
    const url = `/your-companies/presenter-already-added/${companyNumber}`;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, auth and company authorisation before returning the your-companies page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "English", langVersion: undefined, lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and expected $langInfo content if language version set to '$langVersion'",
        async ({ langVersion, lang, langCommon }) => {
            // Given
            when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.COMPANY_NUMBER).mockReturnValue(companyNumber);
            when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.COMPANY_NAME).mockReturnValue(companyName);
            when(sessionUtils.getExtraData).calledWith(expect.anything(), constants.AUTHORISED_PERSON_EMAIL).mockReturnValue(userEmail);
            const expectedCaption = `${companyName} (${companyNumber})`;
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(expectedCaption);
            expect(response.text).toContain(lang.this_person_is_already_authorised);
            expect(response.text).toContain(lang.the_person_with_the_email_address);
            expect(response.text).toContain(userEmail);
            expect(response.text).toContain(lang.has_already_been_digitally_authorised);
            expect(response.text).toContain(langCommon.go_back_to_your_companies2);
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
