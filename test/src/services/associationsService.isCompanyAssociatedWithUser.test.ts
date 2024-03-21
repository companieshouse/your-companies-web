
import * as associationsService from "../../../src/services/associationsService";
import { userAssociations } from "../../mocks/associations.mock";
import { Request } from "express";
import * as constants from "../../../src/constants";
jest.mock("../../../src/services/apiClientService");

const reqest = {} as Request;

describe("associationsService", () => {

    describe("isCompanyAssociatedWithUser", () => {
        const mockGetUserAssociations = jest.spyOn(associationsService, "getUserAssociations");
        mockGetUserAssociations.mockResolvedValue(userAssociations);

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return company associated with user response", async () => {
            // Given
            const companyNumber = "NI038379";
            // When
            const result = await associationsService.isCompanyAssociatedWithUser(reqest, companyNumber);
            // Then
            expect(result).toEqual(constants.COMPNANY_ASSOCIATED_WITH_USER);
        });

        it("should return company not associated with user response", async () => {
            // Given
            const companyNumber = "12345678";
            // When
            const result = await associationsService.isCompanyAssociatedWithUser(reqest, companyNumber);
            // Then
            expect(result).toEqual(constants.COMPNANY_NOT_ASSOCIATED_WITH_USER);
        });
    });
});
