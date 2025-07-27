// import { createKeyApiClient } from "../../../../src/services/apiClientService";
// import { Resource } from "@companieshouse/api-sdk-node";
// import { searchForCompanyAssociationByEmail } from "../../../../src/services/associationsService";
// import { Association } from "@companieshouse/api-sdk-node/dist/services/associations/types";
// import { StatusCodes } from "http-status-codes";
// // import { mockRequest } from "../../../mocks/request.mock";
// // import { BadRequest } from "http-errors";
// import { singleAwaitingApprovalAssociation } from "../../../mocks/associations.mock";

// jest.mock("../../../../src/services/apiClientService");
// jest.mock("../../../../src/lib/Logger");

// const mockCreateKeyApiClient = createKeyApiClient as jest.Mock;
// const mockSearchForCompanyAssociationByEmail = jest.fn();

// mockCreateKeyApiClient.mockReturnValue({
//     associationsService: {
//         searchForCompanyAssociationByEmail: mockSearchForCompanyAssociationByEmail
//     }
// });

// // const request = mockRequest();
// const companyNumber = "AB123456";
// const searchEmailAddress = "eva.brown@test.com";

// describe("associationsService", () => {
//     describe("searchForCompanyAssociationByEmail", () => {

//         beforeEach(() => {
//             jest.clearAllMocks();
//         });

//         it("should return an association link when an association is found", async () => {
            // Given
            // const associationLink = "/associations/0123456789";
            // const sdkResource: Resource<Association> = {
            //     httpStatusCode: StatusCodes.OK,
            //     resource: singleAwaitingApprovalAssociation
            // };
       //    mockSearchForCompanyAssociationByEmail.mockResolvedValueOnce(sdkResource);
            //  mockPostInvitation.mockResolvedValue(sdkResource);
            // When
            //   const result = await searchForCompanyAssociationByEmail(companyNumber, searchEmailAddress);
            // Then
            //        expect(result).toEqual(sdkResource.resource);
   //     });

        // it("should throw an error if no response returned from SDK", async () => {
        //     mockPostInvitation.mockResolvedValueOnce(undefined);

        //     await postInvitation(request, companyNumber, inviteeEmailAddress)
        //         .catch((error) => {
        //             expect(error.message).toBe("No response from POST /associations/invitations");
        //         });
        // });

        // it("should throw an error if status code other than 201", async () => {
        //     mockPostInvitation.mockResolvedValueOnce({
        //         httpStatusCode: StatusCodes.BAD_REQUEST
        //     } as Resource<Errors>);

        //     await expect(postInvitation(request, companyNumber, inviteeEmailAddress))
        //         .rejects.toThrow(BadRequest);
        // });

        // it("Should throw an error if no response resource returned from SDK", async () => {
        //     const HTTP_STATUS_CODE = StatusCodes.CREATED;
        //     mockPostInvitation.mockResolvedValueOnce({
        //         httpStatusCode: HTTP_STATUS_CODE
        //     } as Resource<NewAssociationResponse>);

        //     await postInvitation(request, companyNumber, inviteeEmailAddress)
        //         .catch((error) => {
        //             expect(error.message).toBe("POST /associations/invitations: 201 status but no resource found");
        //         });
        // });
    });
});
