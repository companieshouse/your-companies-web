import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as en from "../../../../src/locales/en/translation/company-invitations-decline.json";
import * as cy from "../../../../src/locales/cy/translation/company-invitations-decline.json";
import { updateAssociationStatus } from "../../../../src/services/associationsService";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import * as constants from "../../../../src/constants";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

jest.mock("../../../../src/services/associationsService");

const router = supertest(app);
const associationId = "123456";
const companyName = "Doughnuts Limited";
const url = `/your-companies/company-invitations-decline/${associationId}?companyName=${companyName}`;

describe("GET /your-companies/companies-invitations-decline/:associationId", () => {

    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
    const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

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

    it("should return expected English content if language version set to English", async () => {
        // Given
        const langVersion = "&lang=en";
        getExtraDataSpy.mockReturnValue("");
        // When
        const response = await router.get(`${url}${langVersion}`);
        // Then
        expect(updateAssociationStatus).toHaveBeenCalled();
        expect(response.text).toContain(en.invitation_declined);
        expect(response.text).toContain(`${en.you_have_declined_to_be_digitally_authorised}${companyName}`);
        expect(response.text).toContain(en.what_happens_now_youve_declined);
        expect(response.text).toContain(en.weve_sent_an_email);
        expect(response.text).toContain(en.view_your_companies);
    });

    it("should return expected Welsh content if language version set to Welsh", async () => {
        // Given
        const langVersion = "&lang=cy";
        getExtraDataSpy.mockReturnValue("");
        // When
        const response = await router.get(`${url}${langVersion}`);
        // Then
        expect(updateAssociationStatus).toHaveBeenCalled();
        expect(response.text).toContain(cy.invitation_declined);
        expect(response.text).toContain(`${cy.you_have_declined_to_be_digitally_authorised}${companyName}`);
        expect(response.text).toContain(cy.what_happens_now_youve_declined);
        expect(response.text).toContain(cy.weve_sent_an_email);
        expect(response.text).toContain(cy.view_your_companies);
    });

    it("should return status 302 on page redirect", async () => {
        redirectPageSpy.mockReturnValue(true);
        getExtraDataSpy.mockReturnValue("");
        await router.get(url).expect(302);
    });

    it("should return correct response message including desired url path", async () => {
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        getExtraDataSpy.mockReturnValue("");
        const response = await router.get(url);
        expect(response.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    it("should redirect back to people digitally authorised page if association already declined", async () => {
        // Given
        const langVersion = "&lang=cy";
        redirectPageSpy.mockReturnValue(false);
        getExtraDataSpy.mockReturnValue(constants.TRUE);
        const urlPath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL;
        // When
        const result = await router.get(`${url}${langVersion}`);
        // Then
        expect(result.statusCode).toEqual(302);
        expect(result.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    it("should return viewData when association state has changed and referrer includes the correct URL for decline", async () => {
        // Given
        const langVersion = "&lang=en";
        const fullUrl = `${url}${langVersion}`;
        const referrerUrl = `http://localhost${constants.YOUR_COMPANIES_COMPANY_INVITATIONS_DECLINE_URL.replace(":associationId", associationId)}?${constants.COMPANY_NAME}=${encodeURIComponent(companyName)}`;
        getExtraDataSpy.mockReturnValue(constants.TRUE);
        // When
        const result = await router
            .get(fullUrl)
            .set("Referer", referrerUrl);
        // Then
        expect(result.statusCode).toBe(200);
        expect(result.text).toContain(companyName);
        expect(result.text).toContain(en.invitation_declined);
        expect(result.text).toContain(en.view_your_companies);
        expect(result.text).toContain(constants.LANDING_URL);
    });
});
