
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
        // Given
        mockGetUserAssociations.mockResolvedValue(twentyConfirmedAssociations);
        // When
        const response = await router.get("/your-companies");
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(response.text).toContain("Search");
        expect(response.text).toContain("Page 1");
        expect(response.text).toContain("Page 2");
        expect(response.text).toContain("Next");
    });

});
