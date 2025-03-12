import { Request } from "express";
import * as constants from "../../../../src/constants";
import * as associationsService from "../../../../src/services/associationsService";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";

const reqest = {} as Request;
const updateAssociationStatusSpy = jest.spyOn(associationsService, "updateAssociationStatus");
updateAssociationStatusSpy.mockImplementation(jest.fn());

jest.mock("../../../../src/lib/Logger");

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

        it("should throw an error if associationId not provided", async () => {
            // Given
            const associationId = undefined;
            const expectedError = createError(StatusCodes.BAD_REQUEST, "Error on removal/cancellation: associtionId not provided");
            // When / Then
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await expect(associationsService.removeUserFromCompanyAssociations(reqest, associationId!))
                .rejects.toEqual(expectedError);
        });
    });
});
