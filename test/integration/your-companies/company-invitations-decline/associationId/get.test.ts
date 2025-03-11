import mocks from "../../../../mocks/all.middleware.mock";
import app from "../../../../../src/app";
import supertest from "supertest";
import en from "../../../../../locales/en/company-invitations-decline.json";
import cy from "../../../../../locales/cy/company-invitations-decline.json";
import { updateAssociationStatus } from "../../../../../src/services/associationsService";
import * as referrerUtils from "../../../../../src/lib/utils/referrerUtils";
import * as constants from "../../../../../src/constants";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";
import { getFullUrl } from "../../../../../src/lib/utils/urlUtils";

jest.mock("../../../../../src/lib/Logger");
jest.mock("../../../../../src/services/associationsService");

const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

const router = supertest(app);
const associationId = "123456";
const companyName = "Morrisons";
const url = `/your-companies/company-invitations-decline/${associationId}?companyName=${companyName}`;

describe("GET /your-companies/companies-invitations-decline/:associationId", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    redirectPageSpy.mockReturnValue(false);

    it("should check session and auth before returning the /your-companies/companies-invitations-decline/:associationId page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        getExtraDataSpy.mockReturnValue("");
        await router.get(url).expect(200);
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "English", langVersion: undefined, lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return expected $langInfo content if language version set to $langVersion",
        async ({ langVersion, lang }) => {
            // Given
            getExtraDataSpy.mockReturnValue("");
            // When
            const response = await router.get(`${url}&lang=${langVersion}`);
            // Then
            expect(updateAssociationStatus).toHaveBeenCalled();
            expect(response.text).toContain(lang.invitation_declined);
            expect(response.text).toContain(`${lang.you_have_declined_to_be_digitally_authorised}${companyName}`);
            expect(response.text).toContain(lang.what_happens_now_youve_declined);
            expect(response.text).toContain(lang.weve_sent_an_email);
            expect(response.text).toContain(lang.view_your_companies);
        });

    it("should return status 302 and correct response message including desired url path on page redirect", async () => {
        // Given
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        getExtraDataSpy.mockReturnValue("");
        // When
        const response = await router.get(url);
        // Then
        expect(response.status).toEqual(302);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    it("should redirect back to people digitally authorised page if association already declined", async () => {
        // Given
        redirectPageSpy.mockReturnValue(false);
        getExtraDataSpy.mockReturnValue(constants.TRUE);
        const urlPath = getFullUrl(constants.COMPANY_INVITATIONS_URL);
        // When
        const result = await router.get(url);
        // Then
        expect(result.statusCode).toEqual(302);
        expect(result.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    test.each([
        { langInfo: "English", langVersion: "en", lang: en },
        { langInfo: "English", langVersion: undefined, lang: en },
        { langInfo: "Welsh", langVersion: "cy", lang: cy }
    ])("should return $langInfo viewData when association state has changed and referrer includes the correct URL for decline and language version set to $langVersion",
        async ({ langVersion, lang }) => {
            // Given
            const fullUrl = `${url}&lang=${langVersion}`;
            const referrerUrl = `http://localhost${getFullUrl(constants.COMPANY_INVITATIONS_DECLINE_URL).replace(":associationId", associationId)}?${constants.COMPANY_NAME}=${encodeURIComponent(companyName)}`;
            getExtraDataSpy.mockReturnValue(constants.TRUE);
            // When
            const result = await router
                .get(fullUrl)
                .set("Referer", referrerUrl);
            // Then
            expect(result.statusCode).toBe(200);
            expect(result.text).toContain(companyName);
            expect(result.text).toContain(lang.invitation_declined);
            expect(result.text).toContain(lang.view_your_companies);
            expect(result.text).toContain(constants.LANDING_URL);
        });
});
