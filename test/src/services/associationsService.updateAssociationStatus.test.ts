import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { updateAssociationStatus } from "../../../src/services/associationsService";
import { AssociationStatus, Errors } from "private-api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
jest.mock("../../../src/services/apiClientService");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockUpdateAssociationStatus = jest.fn();

mockCreateOauthPrivateApiClient.mockReturnValue({
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
            expect(mockCreateOauthPrivateApiClient).toHaveBeenCalled();
            expect(mockUpdateAssociationStatus).toHaveBeenCalled();
        });

        it("should return an error if no response returned from SDK", async () => {
            mockUpdateAssociationStatus.mockResolvedValueOnce(undefined);

            await expect(updateAssociationStatus(reqest, associationId, status))
                .rejects.toBe(undefined);
        });

        it("should throw an error if status code other than 200", async () => {
            const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
            mockUpdateAssociationStatus.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<Errors>);

            await expect(updateAssociationStatus(reqest, associationId, status))
                .rejects.toEqual({ httpStatusCode: StatusCodes.BAD_REQUEST });
        });
    });
});
