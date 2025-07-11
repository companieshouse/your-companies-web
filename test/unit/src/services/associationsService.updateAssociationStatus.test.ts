import { Resource } from "@companieshouse/api-sdk-node";
import { createOAuthApiClient } from "../../../../src/services/apiClientService";
import { updateAssociationStatus } from "../../../../src/services/associationsService";
import { AssociationStatus, Errors } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import createError from "http-errors";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const mockCreateOauthApiClient = createOAuthApiClient as jest.Mock;
const mockUpdateAssociationStatus = jest.fn();

mockCreateOauthApiClient.mockReturnValue({
    associationsService: {
        updateAssociationStatus: mockUpdateAssociationStatus
    }
});

const reqest = {} as Request;
const associationId = "0123456789";
const status = AssociationStatus.CONFIRMED;

describe("associationsService", () => {
    describe("updateAssociationStatus", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should call the API client and updateAssociationStatus function from private-api-sdk-node if association status updated", async () => {
            // Given
            const sdkResource: Resource<undefined> = {
                httpStatusCode: StatusCodes.OK
            };
            mockUpdateAssociationStatus.mockResolvedValueOnce(sdkResource);
            // When
            await updateAssociationStatus(reqest, associationId, status);
            // Then
            expect(mockCreateOauthApiClient).toHaveBeenCalled();
            expect(mockUpdateAssociationStatus).toHaveBeenCalled();
        });

        it("should return an error if no response returned from SDK", async () => {
            mockUpdateAssociationStatus.mockResolvedValueOnce(undefined);

            await expect(updateAssociationStatus(reqest, associationId, status))
                .rejects.toThrow(`Associations API for an association with id ${associationId}, the associations API response was null, undefined or falsy.`);
        });

        it("should throw an http error if status code other than 200", async () => {
            const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
            const badRequestError = createError(HTTP_STATUS_CODE, `"No error list returned" Http status code ${HTTP_STATUS_CODE} - Failed to change status for an association with id ${associationId}`);

            mockUpdateAssociationStatus.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<Errors>);
            await expect(updateAssociationStatus(reqest, associationId, status))
                .rejects.toEqual(badRequestError);
        });
    });
});
