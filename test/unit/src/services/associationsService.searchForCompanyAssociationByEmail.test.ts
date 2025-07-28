import { createKeyApiClient } from "../../../../src/services/apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import { searchForCompanyAssociationByEmail } from "../../../../src/services/associationsService";
import { Association, Errors } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { singleAwaitingApprovalAssociation } from "../../../mocks/associations.mock";
import { HttpError, BadRequest } from "http-errors";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const mockCreateKeyApiClient = createKeyApiClient as jest.Mock;
const mockSearchForCompanyAssociation = jest.fn();

mockCreateKeyApiClient.mockReturnValue({
    associationsService: {
        searchForCompanyAssociation: mockSearchForCompanyAssociation
    }
});

const companyNumber = "AB123456";
const searchEmailAddress = "eva.brown@test.com";

describe("associationsService", () => {
    describe("searchForCompanyAssociationByEmail", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return an association when an association is found", async () => {
            //    Given
            const sdkResource: Resource<Association> = {
                httpStatusCode: StatusCodes.OK,
                resource: singleAwaitingApprovalAssociation
            };
            mockSearchForCompanyAssociation.mockResolvedValueOnce(sdkResource);
            //      When
            const result = await searchForCompanyAssociationByEmail(companyNumber, searchEmailAddress);
            //     Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should throw a HttpError if no response returned from SDK", async () => {
            mockSearchForCompanyAssociation.mockResolvedValueOnce(undefined);

            await expect(searchForCompanyAssociationByEmail(companyNumber, searchEmailAddress))
                .rejects.toThrow(HttpError);
        });

        it("should throw an error if status code other than 200 or 404", async () => {
            mockSearchForCompanyAssociation.mockResolvedValueOnce({
                httpStatusCode: StatusCodes.BAD_REQUEST
            } as Resource<Errors>);

            await expect(searchForCompanyAssociationByEmail(companyNumber, searchEmailAddress))
                .rejects.toThrow(BadRequest);
        });

        it("should return null if 404 is returned with errors from sdk", async () => {
            //    Given
            const sdkResource: Resource<Errors> = {
                httpStatusCode: StatusCodes.NOT_FOUND,
                resource: { errors: [] }
            };
            mockSearchForCompanyAssociation.mockResolvedValueOnce(sdkResource);
            //      When
            const result = await searchForCompanyAssociationByEmail(companyNumber, searchEmailAddress);
            //     Then
            expect(result).toEqual(null);
        });

    });
});
