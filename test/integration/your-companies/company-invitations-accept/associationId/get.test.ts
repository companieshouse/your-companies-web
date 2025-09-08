import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import en from "../../../../../locales/en/company-invitations-accept.json";
import cy from "../../../../../locales/cy/company-invitations-accept.json";
import enCommon from "../../../../../locales/en/common.json";
import cyCommon from "../../../../../locales/cy/common.json";
import { updateAssociationStatus } from "../../../../../src/services/associationsService";
import * as constants from "../../../../../src/constants";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { getFullUrl } from "../../../../../src/lib/utils/urlUtils";
import { Request, Response } from "express";

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/services/associationsService");

const router = supertest(app);
const associationId = "0123456789";
const companyName = "MORRISONS";
const url = `/your-companies/company-invitations-accept/${associationId}?companyName=${companyName}`;

const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

describe("GET /your-companies/company-invitations-accept/:associationId", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en, langCommon: enCommon },
        { langInfo: "Welsh", langVersion: "cy", lang: cy, langCommon: cyCommon }
    ])("should return status 200 and expected $langInfo content if language set to '$langVersion'",
        async ({ langVersion, lang, langCommon }) => {
            // Given
            const expectedBannerText = `${lang.you_have_accepted}${companyName}.`;
            getExtraDataSpy.mockReturnValue("");
            // When
            const result = await router.get(`${url}&lang=${langVersion}`);
            // Then
            expect(result.status).toEqual(200);
            expect(updateAssociationStatus).toHaveBeenCalled();
            expect(result.text).toContain(langCommon.success);
            expect(result.text).toContain(expectedBannerText);
            expect(result.text).toContain(lang.what_happens_now);
            expect(result.text).toContain(lang.you_can_now);
            expect(result.text).toContain(lang.bullet_list[0]);
            expect(result.text).toContain(lang.bullet_list[1]);
            expect(result.text).toContain(lang.bullet_list[2]);
            expect(result.text).toContain(lang.weve_sent_an_email);
            expect(result.text).toContain(lang.go_to_your_companies);
        });

    it("should redirect back to people digitally authorised page if association already accepted", async () => {
        // Given
        getExtraDataSpy.mockReturnValue(constants.TRUE);
        const urlPath = getFullUrl(constants.COMPANY_INVITATIONS_URL);
        // When
        const result = await router.get(url);
        // Then
        expect(result.statusCode).toEqual(302);
        expect(result.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    it("should return viewData when association state has changed and referrer includes the correct URL", async () => {
        // Given
        const referrerUrl = `http://localhost${getFullUrl(constants.COMPANY_INVITATIONS_ACCEPT_URL).replace(":associationId", associationId)}?${constants.COMPANY_NAME}=${encodeURIComponent(companyName)}`;
        getExtraDataSpy.mockReturnValue(constants.TRUE);
        // When
        const result = await router
            .get(url)
            .set("Referer", referrerUrl);
        // Then
        expect(result.statusCode).toBe(200);
        expect(result.text).toContain(companyName);
        expect(result.text).toContain(constants.LANDING_URL);
    });

    it("should return status 302 and correct response message including desired url path on page redirect", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        mocks.mockNavigationMiddleware.mockImplementation((req: Request, res: Response) => {
            res.redirect(urlPath);
        });
        getExtraDataSpy.mockReturnValue("");
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });
});
