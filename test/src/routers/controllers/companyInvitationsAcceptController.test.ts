import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as en from "../../../../locales/en/company-invitations-accept.json";
import * as cy from "../../../../locales/cy/company-invitations-accept.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import { updateAssociationStatus } from "../../../../src/services/associationsService";
import * as referrerUtils from "../../../../src/lib/utils/referrerUtils";
import * as constants from "../../../../src/constants";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

jest.mock("../../../../src/services/associationsService");

const router = supertest(app);
const url = "/your-companies/company-invitations-accept/:associationId";
const associationId = "0123456789";
const companyName = "Morrisons";
const companyNameQueryParam = `companyName=${companyName}`;

describe(`GET ${url}`, () => {

    const redirectPageSpy: jest.SpyInstance = jest.spyOn(referrerUtils, "redirectPage");
    const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    redirectPageSpy.mockReturnValue(false);

    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if English language selected", async () => {
        // Given
        const lang = "&lang=en";
        const queryString = `?${lang}&${companyNameQueryParam}`;
        const expectedBannerText = `${en.you_have_accepted}${companyName}.`;
        getExtraDataSpy.mockReturnValue("");
        // When
        const result = await router.get(`${url.replace(":associationId", associationId)}${queryString}`);
        // Then
        expect(updateAssociationStatus).toHaveBeenCalled();
        expect(result.text).toContain(enCommon.success);
        expect(result.text).toContain(expectedBannerText);
        expect(result.text).toContain(en.what_happens_now);
        expect(result.text).toContain(en.you_can_now);
        expect(result.text).toContain(en.bullet_list[0]);
        expect(result.text).toContain(en.bullet_list[1]);
        expect(result.text).toContain(en.bullet_list[2]);
        expect(result.text).toContain(en.weve_sent_an_email_to_the_company);
        expect(result.text).toContain(en.view_your_companies);
    });

    it("should return expected Welsh content if Welsh language selected", async () => {
        // Given
        const lang = "&lang=cy";
        const queryString = `?${lang}&${companyNameQueryParam}`;
        const expectedBannerText = `${cy.you_have_accepted}${companyName}.`;
        getExtraDataSpy.mockReturnValue("");
        // When
        const result = await router.get(`${url.replace(":associationId", associationId)}${queryString}`);
        // Then
        expect(updateAssociationStatus).toHaveBeenCalled();
        expect(result.text).toContain(cyCommon.success);
        expect(result.text).toContain(expectedBannerText);
        expect(result.text).toContain(cy.what_happens_now);
        expect(result.text).toContain(cy.you_can_now);
        expect(result.text).toContain(cy.bullet_list[0]);
        expect(result.text).toContain(cy.bullet_list[1]);
        expect(result.text).toContain(cy.bullet_list[2]);
        expect(result.text).toContain(cy.weve_sent_an_email_to_the_company);
        expect(result.text).toContain(cy.view_your_companies);
    });

    it("should return status 302 on page redirect", async () => {
        // Given
        const lang = "&lang=cy";
        const queryString = `?${lang}&${companyNameQueryParam}`;
        redirectPageSpy.mockReturnValue(true);
        getExtraDataSpy.mockReturnValue("");
        // When
        const result = await router.get(`${url.replace(":associationId", associationId)}${queryString}`);
        // Then
        expect(result.statusCode).toEqual(302);
    });

    it("should return correct response message including desired url path", async () => {
        // Given
        const lang = "&lang=cy";
        const queryString = `?${lang}&${companyNameQueryParam}`;
        const urlPath = constants.LANDING_URL;
        redirectPageSpy.mockReturnValue(true);
        getExtraDataSpy.mockReturnValue("");
        // When
        const result = await router.get(`${url.replace(":associationId", associationId)}${queryString}`);
        // Then
        expect(result.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    it("should redirect back to people digitally authorised page if association already accepted", async () => {
        // Given
        const lang = "&lang=cy";
        const queryString = `?${lang}&${companyNameQueryParam}`;
        redirectPageSpy.mockReturnValue(false);
        getExtraDataSpy.mockReturnValue(constants.TRUE);
        const urlPath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL;
        // When
        const result = await router.get(`${url.replace(":associationId", associationId)}${queryString}`);
        // Then
        expect(result.statusCode).toEqual(302);
        expect(result.text).toEqual(`Found. Redirecting to ${urlPath}`);
    });

    it("should return viewData when association state has changed and referrer includes the correct URL", async () => {
        // Given
        const lang = "&lang=en";
        const queryString = `?${lang}&${companyNameQueryParam}`;
        const fullUrl = `${url.replace(":associationId", associationId)}${queryString}`;
        const referrerUrl = `http://localhost${constants.YOUR_COMPANIES_COMPANY_INVITATIONS_ACCEPT_URL.replace(":associationId", associationId)}?${constants.COMPANY_NAME}=${encodeURIComponent(companyName)}`;
        getExtraDataSpy.mockReturnValue(constants.TRUE);
        // When
        const result = await router
            .get(fullUrl)
            .set("Referer", referrerUrl);
        // Then
        expect(result.statusCode).toBe(200);
        expect(result.text).toContain(companyName);
        expect(result.text).toContain(constants.LANDING_URL);
    });
});
