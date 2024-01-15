import app from "../../../src/app";
import supertest from "supertest";
const router = supertest(app);
const en = require("../../../src/locales/en/translation/confirm-company-details.json");
const cy = require("../../../src/locales/cy/translation/confirm-company-details.json");
const url = "/your-companies/confirm-company-details";

describe(`GET ${url}`, () => {
    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.confirm_this_is_the_correct_company);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
        expect(response.text).toContain(en.status);
        expect(response.text).toContain(en.incorporation_date);
        expect(response.text).toContain(en.company_type);
        expect(response.text).toContain(en.registered_office_address);
        expect(response.text).toContain(en.confirm_and_continue);
        expect(response.text).toContain(en.choose_a_different_company);
    });

    it("should return expected Welsh content when welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.confirm_this_is_the_correct_company);
        expect(response.text).toContain(cy.company_name);
        expect(response.text).toContain(cy.company_number);
        expect(response.text).toContain(cy.status);
        expect(response.text).toContain(cy.incorporation_date);
        expect(response.text).toContain(cy.company_type);
        expect(response.text).toContain(cy.registered_office_address);
        expect(response.text).toContain(cy.confirm_and_continue);
        expect(response.text).toContain(cy.choose_a_different_company);
    });
});
