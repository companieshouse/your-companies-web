
// the order of the mock imports matter
import mocks from "../../mocks/all.middleware.mock";
import app from "../../../src/app";
import supertest from "supertest";

const router = supertest(app);

jest.mock("../../../src/lib/utils/sessionUtils", () => {
    const originalModule = jest.requireActual("../../../src/lib/utils/sessionUtils");

    return {
        __esModule: true,
        ...originalModule,
        getLoggedInUserEmail: jest.fn(() => "test@test.com")
    };
});

describe("GET /your-companies", () => {
    const en = require("../../../src/locales/en/translation/your-companies.json");
    const cy = require("../../../src/locales/cy/translation/your-companies.json");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session and auth before returning the your-companies page", async () => {
        await router.get("/your-companies");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get("/your-companies").expect(200);
    });

    it("should return expected English content if no companies added and language version set to English", async () => {
        const response = await router.get("/your-companies?lang=en");
        expect(response.text).toContain(en.add_a_company);
        expect(response.text).toContain(en.add_a_company_to_your_account);
        expect(response.text).toContain(en.bullet_list[0]);
        expect(response.text).toContain(en.bullet_list[1]);
        expect(response.text).toContain(en.you_have_not_added_any_companies);
        expect(response.text).toContain(en.your_companies);
    });

    it("should return expected Welsh content if no companies added and language version set to Welsh", async () => {
        const response = await router.get("/your-companies?lang=cy");
        expect(response.text).toContain(cy.add_a_company);
        expect(response.text).toContain(cy.add_a_company_to_your_account);
        expect(response.text).toContain(cy.bullet_list[0]);
        expect(response.text).toContain(cy.bullet_list[1]);
        expect(response.text).toContain(cy.you_have_not_added_any_companies);
        expect(response.text).toContain(cy.your_companies);
    });
});
