import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../../src/services/apiClientService";
import { getUserAssociations } from "../../../../src/services/associationsService";
import { AssociationList, AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { userAssociations } from "../../../mocks/associations.mock";
import { Request } from "express";
import { HttpError } from "http-errors";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockSearchAssociations = jest.fn();

mockCreateOauthPrivateApiClient.mockReturnValue({
    associationsService: {
        searchAssociations: mockSearchAssociations
    }
});

const reqest = {} as Request;

describe("associationsService", () => {
    describe("getUserAssociations", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return associations", async () => {
            // Given
            const status: AssociationStatus[] = [AssociationStatus.CONFIRMED];
            const sdkResource: Resource<AssociationList> = {
                httpStatusCode: StatusCodes.OK,
                resource: userAssociations
            };
            mockSearchAssociations.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getUserAssociations(reqest, status);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockSearchAssociations.mockResolvedValueOnce(undefined);

            await expect(getUserAssociations(reqest, []))
                .rejects.toBe(undefined);
        });

        it("should throw an error if status code other than 200", async () => {
            const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
            mockSearchAssociations.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<AssociationList>);

            await expect(getUserAssociations(reqest, []))
                .rejects.toThrow(HttpError);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.OK;
            mockSearchAssociations.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<AssociationList>);

            await expect(getUserAssociations(reqest, []))
                .rejects.toEqual({ httpStatusCode: StatusCodes.OK });
        });
    });
});
