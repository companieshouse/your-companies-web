import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../../src/services/apiClientService";
import { postInvitation } from "../../../../src/services/associationsService";
import { Errors, NewAssociationResponse } from "private-api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { mockRequest } from "../../../mocks/request.mock";
import { BadRequest } from "http-errors";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockPostInvitation = jest.fn();

mockCreateOauthPrivateApiClient.mockReturnValue({
    associationsService: {
        postInvitation: mockPostInvitation
    }
});

const request = mockRequest();
const companyNumber = "AB123456";
const inviteeEmailAddress = "eva.brown@test.com";

describe("associationsService", () => {
    describe("postInvitation", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return a new association link when an invite is posted", async () => {
            // Given
            const associationLink = "/associations/0123456789";
            const newAssociationResponse: NewAssociationResponse = { associationLink };
            const sdkResource: Resource<NewAssociationResponse> = {
                httpStatusCode: StatusCodes.CREATED,
                resource: newAssociationResponse
            };
            mockPostInvitation.mockResolvedValue(sdkResource);
            // When
            const result = await postInvitation(request, companyNumber, inviteeEmailAddress);
            // Then
            expect(result).toEqual(associationLink);
        });

        it("should throw an error if no response returned from SDK", async () => {
            mockPostInvitation.mockResolvedValueOnce(undefined);

            await postInvitation(request, companyNumber, inviteeEmailAddress)
                .catch((error) => {
                    expect(error.message).toBe("No response from POST /associations/invitations");
                });
        });

        it("should throw an error if status code other than 201", async () => {
            mockPostInvitation.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.BAD_REQUEST
            } as Resource<Errors>);

            await expect(postInvitation(request, companyNumber, inviteeEmailAddress))
                .rejects.toThrow(BadRequest);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.CREATED;
            mockPostInvitation.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<NewAssociationResponse>);

            await postInvitation(request, companyNumber, inviteeEmailAddress)
                .catch((error) => {
                    expect(error.message).toBe("POST /associations/invitations: 201 status but no resource found");
                });
        });
    });
});
