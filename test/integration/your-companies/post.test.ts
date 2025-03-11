// the order of the mock imports matter
import mocks from "../../mocks/all.middleware.mock";
import app from "../../../src/app";
import supertest from "supertest";
import * as associationsService from "../../../src/services/associationsService";
import { twentyConfirmedAssociations } from "../../mocks/associations.mock";

const router = supertest(app);

jest.mock("../../../src/lib/Logger");
const userAssociationsSpy: jest.SpyInstance = jest.spyOn(associationsService, "getUserAssociations");

describe("POST /your-companies", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        userAssociationsSpy.mockResolvedValue(twentyConfirmedAssociations);

    });

    it("should check session, company and user auth before returning the page", async () => {
        await router.post("/your-companies");
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    test.each([
        {
            condition: "with search query param when search string is posted",
            search: "NI038379",
            redirectMessage: "Found. Redirecting to /your-companies?search=NI03837"
        },
        {
            condition: "without search query param when search string is empty",
            search: "",
            redirectMessage: "Found. Redirecting to /your-companies"
        },
        {
            condition: "without search query param and return error message key when search string has wrong format",
            search: "abc$%",
            redirectMessage: "Found. Redirecting to /your-companies"
        }
    ])("should redirect $condition ",
        async ({ search, redirectMessage }) => {
            // Given
            userAssociationsSpy.mockResolvedValue(twentyConfirmedAssociations);
            // When
            const response = await router.post("/your-companies").send({ search });
            // Then
            expect(response.status).toBe(302);
            expect(response.text).toContain(redirectMessage);
        });
});
