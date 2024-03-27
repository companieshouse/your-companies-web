import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as en from "../../../../src/locales/en/translation/company-invitations-decline.json";
import * as cy from "../../../../src/locales/cy/translation/company-invitations-decline.json";
import { updateAssociationStatus } from "../../../../src/services/associationsService";
jest.mock("../../../../src/services/associationsService");

const router = supertest(app);
const associationId = "123456";
const companyName = "Doughnuts Limited";
const url = `/your-companies/company-invitations-decline/${associationId}?companyName=${companyName}`;

describe("GET /your-companies/companies-invitations-decline/:associationId", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the /your-companies/companies-invitations-decline/:associationId page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if language version set to English", async () => {
        // Given
        const langVersion = "&lang=en";
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
});
