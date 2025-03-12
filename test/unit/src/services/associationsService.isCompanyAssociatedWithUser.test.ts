
import * as associationsService from "../../../../src/services/associationsService";
import {
    demoUserGermanBreweryAssociation,
    demoUserPolishBreweryAssociation,
    demoUserScottishBreweryAssociation,
    emptyAssociations
} from "../../../mocks/associations.mock";
import { Request } from "express";
import { AssociationState, AssociationStateResponse } from "../../../../src/types/associations";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const reqest = {} as Request;

describe("associationsService", () => {

    describe("isOrWasCompanyAssociatedWithUser", () => {
        const mockGetUserAssociations = jest.spyOn(associationsService, "getUserAssociations");

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return company associated with user response", async () => {
            // Given
            const companyNumber = "NI038379";
            mockGetUserAssociations.mockResolvedValue(demoUserPolishBreweryAssociation);
            const expectedAssociationStateResponse: AssociationStateResponse = { state: AssociationState.COMPANY_ASSOCIATED_WITH_USER, associationId: "1234567890" };
            // When
            const result = await associationsService.isOrWasCompanyAssociatedWithUser(reqest, companyNumber);
            // Then
            expect(result).toEqual(expectedAssociationStateResponse);
        });

        it("should return company awaiting association with user response", async () => {
            // Given
            const companyNumber = "NI038333";
            mockGetUserAssociations.mockResolvedValue(demoUserGermanBreweryAssociation);
            const expectedAssociationStateResponse: AssociationStateResponse = { state: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER, associationId: "1234567888" };
            // When
            const result = await associationsService.isOrWasCompanyAssociatedWithUser(reqest, companyNumber);
            // Then
            expect(result).toEqual(expectedAssociationStateResponse);
        });

        it("should return company was associated with user response", async () => {
            // Given
            const companyNumber = "AB012345";
            mockGetUserAssociations.mockResolvedValue(demoUserScottishBreweryAssociation);
            const expectedAssociationStateResponse: AssociationStateResponse = { state: AssociationState.COMPANY_WAS_ASSOCIATED_WITH_USER, associationId: "1122334455" };
            // When
            const result = await associationsService.isOrWasCompanyAssociatedWithUser(reqest, companyNumber);
            // Then
            expect(result).toEqual(expectedAssociationStateResponse);
        });

        it("should return company not associated with user response", async () => {
            // Given
            const companyNumber = "12345678";
            mockGetUserAssociations.mockResolvedValue(emptyAssociations);
            const expectedAssociationStateResponse: AssociationStateResponse = { state: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER };
            // When
            const result = await associationsService.isOrWasCompanyAssociatedWithUser(reqest, companyNumber);
            // Then
            expect(result).toEqual(expectedAssociationStateResponse);
        });
    });
});
