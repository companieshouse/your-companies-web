
import * as associationsService from "../../../src/services/associationsService";
import { demoUserPolishBreweryAssociation, emptyAssociations } from "../../mocks/associations.mock";
import { Request } from "express";
import * as constants from "../../../src/constants";
jest.mock("../../../src/services/apiClientService");

const reqest = {} as Request;

describe("associationsService", () => {

    describe("isCompanyAssociatedWithUser", () => {
        const mockGetCompanyAssociations = jest.spyOn(associationsService, "getCompanyAssociations");

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return company associated with user response", async () => {
            // Given
            const companyNumber = "NI038379";
            const userEmail = "demo@ch.gov.uk";
            mockGetCompanyAssociations.mockResolvedValue(demoUserPolishBreweryAssociation);
            // When
            const result = await associationsService.isCompanyAssociatedWithUser(reqest, companyNumber, userEmail);
            // Then
            expect(result).toEqual(constants.COMPNANY_ASSOCIATED_WITH_USER);
        });

        it("should return company not associated with user response", async () => {
            // Given
            const companyNumber = "12345678";
            const userEmail = "adam.smith@ch.gov.uk";
            mockGetCompanyAssociations.mockResolvedValue(emptyAssociations);
            // When
            const result = await associationsService.isCompanyAssociatedWithUser(reqest, companyNumber, userEmail);
            // Then
            expect(result).toEqual(constants.COMPNANY_NOT_ASSOCIATED_WITH_USER);
        });
    });
});
