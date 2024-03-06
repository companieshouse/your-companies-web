import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { getCompanyProfile } from "../../../../src/services/companyProfileService";
import { isEmailAuthorised } from "../../../../src/services/userCompanyAssociationService";
import { validActiveCompanyProfile } from "../../../mocks/companyProfile.mock";
import { getUrlWithCompanyNumber } from "../../../../src/lib/utils/urlUtils";
import * as en from "../../../../src/locales/en/translation/add-presenter.json";
import * as cy from "../../../../src/locales/cy/translation/add-presenter.json";
jest.mock("../../../../src/services/companyProfileService");
jest.mock("../../../../src/services/userCompanyAssociationService");

const mockGetCompanyProfile = getCompanyProfile as jest.Mock;
const mockIsEmailAuthorised = isEmailAuthorised as jest.Mock;

const router = supertest(app);
const companyNumber = "12345678";
const urlwithCompNum = "/your-companies/add-presenter/:companyNumber";
const url = getUrlWithCompanyNumber(urlwithCompNum, companyNumber);

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetCompanyProfile.mockResolvedValueOnce(validActiveCompanyProfile);
    });
    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });
    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.tell_us_the_email);
        expect(response.text).toContain(en.you_can_change_who);
        expect(response.text).toContain(en.email_address);
    });
    it("should return expected Welsh content if Welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.tell_us_the_email);
        expect(response.text).toContain(cy.you_can_change_who);
        expect(response.text).toContain(cy.email_address);
    });
});

describe(`POST ${url}`, () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetCompanyProfile.mockResolvedValueOnce(validActiveCompanyProfile);
    });

    it("should check session, company and user auth before routing to controller", async () => {
        await router.post(url).send({ email: "" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should display current page with error message if no email provided", async () => {
        const response = await router.post(url).send({ email: "" });
        expect(response.text).toContain(en.errors_email_required);
    });
    it("should display current page with error message if email invalid", async () => {
        const response = await router.post(url).send({ email: "abc" });
        expect(response.text).toContain(en.errors_email_invalid);
    });
    it("should display current page with error message if email is associated with company", async () => {
        mockIsEmailAuthorised.mockResolvedValueOnce(true);
        const response = await router.post(url).send({ email: "bob@bob.com" });
        expect(response.text).toContain(en.errors_email_already_authorised);
    });
    it("should redirect to the check presenter page", async () => {
        mockIsEmailAuthorised.mockResolvedValueOnce(false);
        const response = await router.post(url).send({ email: "bob@bob.com" });
        expect(response.status).toEqual(302);
        expect(response.header.location).toEqual("/your-companies/add-presenter-check-details/12345678");
    });
});
