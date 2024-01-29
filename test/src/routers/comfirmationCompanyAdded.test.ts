import mocks from "../../mocks/all.middleware.mock";
import app from "../../../src/app";
import supertest from "supertest";
const router = supertest(app);
const en = require("../../../src/locales/en/translation/confirmation-company-added.json");
const cy = require("../../../src/locales/cy/translation/confirmation-company-added.json");
const url = "/your-companies/confirmation-company-added";

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should check session, auth and companhy authorisation before returning the your-companies page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.success);
    });

    it("should display 3 bullet points", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.bullet_1);
        expect(response.text).toContain(en.bullet_2);
        expect(response.text).toContain(en.bullet_3);
    });

    it("should return expected Welsh content when welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.success);
    });
});
