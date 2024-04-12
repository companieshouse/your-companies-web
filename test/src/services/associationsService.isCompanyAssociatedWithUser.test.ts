
import * as associationsService from "../../../src/services/associationsService";
import { demoUserPolishBreweryAssociation, demoUserScottishBreweryAssociation, emptyAssociations } from "../../mocks/associations.mock";
import { Request } from "express";
import { AssociationState, AssociationStateResponse } from "../../../src/types/associations";
jest.mock("../../../src/services/apiClientService");

const reqest = {} as Request;

describe("associationsService", () => {

    describe("isOrWasCompanyAssociatedWithUser", () => {
        const mockGetCompanyAssociations = jest.spyOn(associationsService, "getCompanyAssociations");

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return company associated with user response", async () => {
            // Given
            const companyNumber = "NI038379";
            const userEmail = "demo@ch.gov.uk";
            mockGetCompanyAssociations.mockResolvedValue(demoUserPolishBreweryAssociation);
            const expectedAssociationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_ASSOCIATED_WITH_USER, associationId: "1234567890" };
            // When
            const result = await associationsService.isOrWasCompanyAssociatedWithUser(reqest, companyNumber, userEmail);
            // Then
            expect(result).toEqual(expectedAssociationStateResponse);
        });

        it("should return company was associated with user response", async () => {
            // Given
            const companyNumber = "AB012345";
            const userEmail = "demo@ch.gov.uk";
            mockGetCompanyAssociations.mockResolvedValue(demoUserScottishBreweryAssociation);
            const expectedAssociationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_WAS_ASSOCIATED_WITH_USER, associationId: "1122334455" };
            // When
            const result = await associationsService.isOrWasCompanyAssociatedWithUser(reqest, companyNumber, userEmail);
            // Then
            expect(result).toEqual(expectedAssociationStateResponse);
        });

        it("should return company not associated with user response", async () => {
            // Given
            const companyNumber = "12345678";
            const userEmail = "adam.smith@ch.gov.uk";
            mockGetCompanyAssociations.mockResolvedValue(emptyAssociations);
            const expectedAssociationStateResponse: AssociationStateResponse = { state: AssociationState.COMPNANY_NOT_ASSOCIATED_WITH_USER };
            // When
            const result = await associationsService.isOrWasCompanyAssociatedWithUser(reqest, companyNumber, userEmail);
            // Then
            expect(result).toEqual(expectedAssociationStateResponse);
        });
    });
});
