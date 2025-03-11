import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../../src/services/apiClientService";
import { getInvitations } from "../../../../src/services/associationsService";
import { InvitationList } from "private-api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { mockInvitationList } from "../../../mocks/invitations.mock";
import { mockRequest } from "../../../mocks/request.mock";
import { HttpError } from "http-errors";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockInvitationsJestFn = jest.fn();

mockCreateOauthPrivateApiClient.mockReturnValue({
    associationsService: {
        getInvitations: mockInvitationsJestFn
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
            mockInvitationsJestFn.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getInvitations(request);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockInvitationsJestFn.mockResolvedValueOnce(undefined);

            await expect(getInvitations(request))
                .rejects.toThrow();
        });

        it("should throw an error if status code other than 200", async () => {
            mockInvitationsJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.UNAUTHORIZED
            } as Resource<InvitationList>);

            await expect(getInvitations(request))
                .rejects.toThrow(HttpError);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            mockInvitationsJestFn.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.OK
            } as Resource<InvitationList>);

            await expect(getInvitations(request, 3))
                .rejects.toThrow();
        });
    });
});
