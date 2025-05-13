import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../../src/services/apiClientService";
import { getInvitations } from "../../../../src/services/associationsService";
import { InvitationList } from "private-api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { mockInvitationList } from "../../../mocks/invitations.mock";
import { mockRequest } from "../../../mocks/request.mock";
import { HttpError } from "http-errors";
import { refreshToken } from "../../../../src/services/refreshTokenService";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/services/refreshTokenService");
jest.mock("../../../../src/lib/Logger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockGetInvitations = jest.fn();
const mockRefreshToken = refreshToken as jest.Mock;

mockCreateOauthPrivateApiClient.mockReturnValue({
    associationsService: {
        getInvitations: mockGetInvitations
    }
});

const request = mockRequest();

describe("associationsService", () => {
    describe("getInvitations", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return active invitations", async () => {
            // Given
            const sdkResource: Resource<InvitationList> = {
                httpStatusCode: StatusCodes.OK,
                resource: mockInvitationList
            };
            mockGetInvitations.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getInvitations(request);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockGetInvitations.mockResolvedValueOnce(undefined);

            await expect(getInvitations(request))
                .rejects.toThrow();
        });

        it("should throw an error if status code other than 200", async () => {
            mockGetInvitations.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.NOT_FOUND
            } as Resource<InvitationList>);

            await expect(getInvitations(request))
                .rejects.toThrow(HttpError);
        });

        it("should throw an error if no response resource returned from SDK", async () => {
            mockGetInvitations.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.OK
            } as Resource<InvitationList>);

            await expect(getInvitations(request, 3))
                .rejects.toThrow();
        });

        it("should refresh access token and retry api call if status code is 401", async () => {
            const sdkResourceUnauthorised: Resource<InvitationList> = {
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<InvitationList>;
            const sdkResourceNotFound: Resource<InvitationList> = {
                httpStatusCode: StatusCodes.NOT_FOUND
            } as Resource<InvitationList>;
            mockGetInvitations.mockResolvedValueOnce(sdkResourceUnauthorised);
            mockGetInvitations.mockResolvedValueOnce(sdkResourceNotFound);

            await expect(getInvitations(request))
                .rejects.toThrow(HttpError);

            expect(mockGetInvitations).toHaveBeenCalledTimes(2);
            expect(mockRefreshToken).toHaveBeenCalledTimes(1);

        });
    });
});
