// the order of the mock imports matter
import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import { getInvitations, getUserAssociations } from "../../../../src/services/associationsService";
import { emptyAssociations, oneConfirmedAssociation, twentyConfirmedAssociations } from "../../../mocks/associations.mock";
import * as en from "../../../../locales/en/your-companies.json";
import * as cy from "../../../../locales/cy/your-companies.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as enCommon from "../../../../locales/en/common.json";
jest.mock("../../../../src/services/associationsService");

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

const mockGetUserAssociations = getUserAssociations as jest.Mock;
const mockGetInvitations = getInvitations as jest.Mock;

describe("GET /your-companies", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);

    });

    it("should check session, company and user auth before returning the page", async () => {
        await router.get("/your-companies");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return pagination if more than 15 companies returned", async () => {
        // Give
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        mockGetInvitations.mockResolvedValue(oneConfirmedAssociation);
        // When
        const response = await router.get("/your-companies");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(enCommon.next);
    });

    it("should return pagination in Welsh if more than 15 companies returned", async () => {
        // Give
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        mockGetInvitations.mockResolvedValue(oneConfirmedAssociation);

        // When
        const response = await router.get("/your-companies?lang=cy");
        // Then
        expect(response.text).toContain(cy.search);
        expect(response.text).toContain(cyCommon.next);
    });

    it("should return selected page", async () => {
        // Give
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        mockGetInvitations.mockResolvedValue(oneConfirmedAssociation);

        // When
        const response = await router.get("/your-companies?page=2&lang=en");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(enCommon.previous);
        expect(response.text).not.toContain(enCommon.next);
    });

    it("should ignore incorrect page numbers", async () => {
        // Give
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        mockGetInvitations.mockResolvedValue(twentyConfirmedAssociations);
        // When
        const response = await router.get("/your-companies?page=abc");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(enCommon.next);
        expect(response.text).not.toContain(enCommon.previous);

    });

    it("should display company when company number provided and match is found", async () => {
        // Give
        mockGetUserAssociations.mockResolvedValue(oneConfirmedAssociation);
        mockGetInvitations.mockResolvedValue(oneConfirmedAssociation);
        // When
        const response = await router.get("/your-companies?search=NI03837");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain("match found for 'NI03837'");
        expect(response.text).toContain("THE POLISH BREWERY");
        expect(response.text).toContain("NI038379");
        expect(response.text).not.toContain(enCommon.next);
    });

    it("should display no matches when no matches found", async () => {
        // Give
        mockGetUserAssociations.mockResolvedValue(emptyAssociations);
        mockGetInvitations.mockResolvedValue(oneConfirmedAssociation);
        // When
        const response = await router.get("/your-companies?search=ABCDEF");
        // Then
        expect(response.text).toContain(en.search);
        expect(response.text).toContain(en.no_results_found);
    });

    it("shoud display English error message and default table of associations if search value not following company number format and language set to English", async () => {
        // Give
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        // When
        const response = await router.get("/your-companies?lang=en&search=kskksksk");
        // Then
        expect(response.text).toContain(en.company_number_must_only_include);
        expect(response.text).toContain(enCommon.next);
    });

    it("shoud display Welsh error message and default table of associations if search value not following company number format and language set to Welsh", async () => {
        // Give
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        mockGetInvitations.mockResolvedValue(twentyConfirmedAssociations);
        // When
        const response = await router.get("/your-companies?lang=cy&search=kskksksk");
        // Then
        expect(response.text).toContain(cy.company_number_must_only_include);
        expect(response.text).toContain(cyCommon.next);
    });
});

describe("Post /your-companies", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);

    });

    it("should check session, company and user auth before returning the page", async () => {
        await router.post("/your-companies");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect with search query param when search string is posted", async () => {
        // Give
        const redirectMessage = "Found. Redirecting to /your-companies?search=NI03837";
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        // When
        const response = await router.post("/your-companies").send({ search: "NI038379" });
        // Then
        expect(response.status).toBe(302);
        expect(response.text).toContain(redirectMessage);
    });

    it("should redirect without search query param when search string is empty", async () => {
        // Give
        const redirectMessage = "Found. Redirecting to /your-companies";
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        // When
        const response = await router.post("/your-companies").send({ search: "" });
        // Then
        expect(response.status).toBe(302);
        expect(response.text).toContain(redirectMessage);
    });

    it("should redirect without search query param and return error message key when search string has wrong format", async () => {
        // Give
        const redirectMessage = "Found. Redirecting to /your-companies";
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        // When
        const response = await router.post("/your-companies").send({ search: "abc$%" });
        // Then
        expect(response.status).toBe(302);
        expect(response.text).toContain(redirectMessage);
    });
});
