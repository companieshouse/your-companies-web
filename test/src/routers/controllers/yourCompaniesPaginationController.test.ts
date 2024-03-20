
// the order of the mock imports matter
import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { getUserAssociations } from "../../../../src/services/userCompanyAssociationService";
import { twentyConfirmedAssociations } from "../../../mocks/associations.mock";
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
        expect(response.text).toContain("Search");
        expect(response.text).toContain("Page 1");
        expect(response.text).toContain("Page 2");
        expect(response.text).toContain("Next");
    });
    it("should return selected page", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?page=2");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Search");
        expect(response.text).toContain("Page 1");
        expect(response.text).toContain("Page 2");
        expect(response.text).not.toContain("Next");
    });
    it("should ignore incorrect page numbers", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?page=abc");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Search");
        expect(response.text).toContain("Page 1");
        expect(response.text).toContain("Page 2");
        expect(response.text).toContain("Next");
    });
    it("should display company when company number provided and match is found", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?search=NI03837");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Search");
        expect(response.text).toContain("1 match found for ");
        expect(response.text).toContain("THE POLISH BREWERY");
        expect(response.text).toContain("NI038379");
        expect(response.text).not.toContain("Page 2");
        expect(response.text).not.toContain("Next");
    });
    it("should display no matches when no matches found", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?search=search-string-with-no-match");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Search");
        expect(response.text).toContain("0 matches found for ");
    });
    it("should not display matches if empty string is provided in query param", async () => {
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        const response = await router.get("/your-companies?search=");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Search");
        expect(response.text).not.toContain("found for ");
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
