
// the order of the mock imports matter
import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { getUserAssociations } from "../../../../src/services/userCompanyAssociationService";
import { twentyConfirmedAssociations } from "../../../mocks/associations.mock";
import * as en from "../../../../src/locales/en/translation/your-companies.json";
import * as cy from "../../../../src/locales/cy/translation/your-companies.json";
jest.mock("../../../../src/services/userCompanyAssociationService");

const router = supertest(app);

const mockGetUserAssociations = getUserAssociations as jest.Mock;

describe("GET /your-companies", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);

    });

    it("should return pagination if more than 15 companies returned", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(en.next);
    });
    it("should return pagination in Welsh if more than 15 companies returned", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?lang=cy");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain(cy.search);
        expect(response.text).toContain(cy.next);
    });
    it("should return selected page", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?page=2");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(en.previous);
        expect(response.text).not.toContain(en.next);
    });
    it("should ignore incorrect page numbers", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?page=abc");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(en.next);
        expect(response.text).not.toContain(en.previous);

    });
    it("should display company when company number provided and match is found", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?search=NI03837");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain(en.search);
        expect(response.text).toContain("1 match found for ");
        expect(response.text).toContain("THE POLISH BREWERY");
        expect(response.text).toContain("NI038379");
        expect(response.text).not.toContain(en.next);
    });
    it("should display no matches when no matches found", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?search=search-string-with-no-match");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(`0 ${en.matches_found_for}`);
    });
    it("should not display number of matches if empty string is provided in query param", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?search=");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain(en.search);
        expect(response.text).not.toContain(en.match_found_for);
        expect(response.text).not.toContain(en.matches_found_for);
    });
});

describe("Post /your-companies", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);

    });

    it("should redirect with search query param when search string is posted", async () => {
        const redirectMessage = "Found. Redirecting to /your-companies?search=NI03837";
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.post("/your-companies").send({ search: "NI038379" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.status).toBe(302);
        expect(response.text).toContain(redirectMessage);
    });
    it("should redirect without search query pararm when search string is empty", async () => {
        const redirectMessage = "Found. Redirecting to /your-companies";
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.post("/your-companies").send({ search: "" });
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.status).toBe(302);
        expect(response.text).toContain(redirectMessage);
    });
});
