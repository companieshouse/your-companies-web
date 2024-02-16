import mocks from "../../mocks/all.middleware.mock";
import app from "../../../src/app";
import supertest from "supertest";
import { getCompanyProfile } from "../../../src/services/companyProfileService";
import { validActiveCompanyProfile } from "../../mocks/companyProfile.mock";
jest.mock("../../../src/services/companyProfileService");
const router = supertest(app);
const en = require("../../../src/locales/en/translation/confirmation-company-added.json");
const cyCommon = require("../../../src/locales/cy/translation/common.json");
const enCommon = require("../../../src/locales/en/translation/common.json");
const companyNumber = "12345678";
const url = `/your-companies/company/${companyNumber}/confirmation-company-added`;
const mockGetCompanyProfile = getCompanyProfile as jest.Mock;

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetCompanyProfile.mockResolvedValueOnce(validActiveCompanyProfile);
    });
    it("should check session, auth and company authorisation before returning the your-companies page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockCompanyAuthenticationMiddleware).toHaveBeenCalled();
        expect(mockGetCompanyProfile).toHaveBeenCalledWith(companyNumber);
    });
    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(enCommon.success);
    });

    it("should display the company name", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain("Test Company");
    });

    it("should display 3 bullet points", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.bullet_1);
        expect(response.text).toContain(en.bullet_2);
        expect(response.text).toContain(en.bullet_3);
    });

    it("should return expected Welsh content when welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cyCommon.success);
    });
});
