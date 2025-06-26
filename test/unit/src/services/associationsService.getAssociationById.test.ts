import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../../src/services/apiClientService";
import { getAssociationById } from "../../../../src/services/associationsService";
import { Association } from "private-api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { singleAwaitingApprovalAssociation } from "../../../mocks/associations.mock";
import { mockRequest } from "../../../mocks/request.mock";
import { HttpError } from "http-errors";
import { refreshToken } from "../../../../src/services/refreshTokenService";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/services/refreshTokenService");
jest.mock("../../../../src/lib/Logger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockGetAssociationById = jest.fn();
const mockRefreshToken = refreshToken as jest.Mock;

mockCreateOauthPrivateApiClient.mockReturnValue({
    associationsService: {
        getAssociation: mockGetAssociationById
    }
});

const request = mockRequest();

describe("associationsService", () => {
    describe("getAssociationById", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return an association", async () => {
            // Given
            const sdkResource: Resource<Association> = {
                httpStatusCode: StatusCodes.OK,
                resource: singleAwaitingApprovalAssociation
            };
            mockGetAssociationById.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getAssociationById(request, "1234567890");
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockGetAssociationById.mockResolvedValueOnce(undefined);

            await expect(getAssociationById(request, "1234567890"))
                .rejects.toThrow();
        });

        it("should throw an error if status code other than 200", async () => {
            mockGetAssociationById.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NOT_FOUND
            } as Resource<Association>);

            await expect(getAssociationById(request, "1234567890"))
                .rejects.toThrow(HttpError);
        });

        it("should throw an error if no response resource returned from SDK", async () => {
            mockGetAssociationById.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.OK
            } as Resource<Association>);

            await expect(getAssociationById(request, "1234567890"))
                .rejects.toThrow();
        });

        it("should refresh access token and retry api call if status code is 401", async () => {
            const sdkResourceUnauthorised: Resource<Association> = {
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<Association>;
            const sdkResourceNotFound: Resource<Association> = {
                httpStatusCode: StatusCodes.NOT_FOUND
            } as Resource<Association>;
            mockGetAssociationById.mockResolvedValueOnce(sdkResourceUnauthorised);
            mockGetAssociationById.mockResolvedValueOnce(sdkResourceNotFound);

            await expect(getAssociationById(request, "1234567890"))
                .rejects.toThrow(HttpError);

            expect(mockGetAssociationById).toHaveBeenCalledTimes(2);
            expect(mockRefreshToken).toHaveBeenCalledTimes(1);

        });
    });
});
