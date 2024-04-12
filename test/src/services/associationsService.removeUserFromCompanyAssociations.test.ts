import { Request } from "express";
import * as constants from "../../../src/constants";
import * as associationsService from "../../../src/services/associationsService";

const reqest = {} as Request;
const updateAssociationStatusSpy = jest.spyOn(associationsService, "updateAssociationStatus");
updateAssociationStatusSpy.mockImplementation(jest.fn());

describe("associationsService", () => {
    describe("isOrWasCompanyAssociatedWithUser", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return user removed from company associations response", async () => {
            // Given
            const associationId = "0123456789";
            // When
            const result = await associationsService.removeUserFromCompanyAssociations(reqest, associationId);
            // Then
            expect(updateAssociationStatusSpy).toHaveBeenCalled();
            expect(result).toEqual(constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        });
    });
});
