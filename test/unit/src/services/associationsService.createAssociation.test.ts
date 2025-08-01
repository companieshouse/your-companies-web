import { Resource } from "@companieshouse/api-sdk-node";
import { createKeyApiClient } from "../../../../src/services/apiClientService";
import { createAssociation } from "../../../../src/services/associationsService";
import { Errors, NewAssociationResponse } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import createError from "http-errors";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const mockCreateKeyApiClient = createKeyApiClient as jest.Mock;
const mockCreateAssociation = jest.fn();

mockCreateKeyApiClient.mockReturnValue({
    associationsService: {
        createAssociation: mockCreateAssociation
    }
});

const reqest = {} as Request;
const companyNumber = "AB123456";

describe("associationsService", () => {
    describe("createAssociation", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return a new association link when the association is created", async () => {
            // Given
            const associationLink = "/associations/0123456789";
            const newAssociationResponse: NewAssociationResponse = { associationLink };
            const sdkResource: Resource<NewAssociationResponse> = {
                httpStatusCode: StatusCodes.CREATED,
                resource: newAssociationResponse
            };
            mockCreateAssociation.mockResolvedValue(sdkResource);
            // When
            const result = await createAssociation(reqest, companyNumber);
            // Then
            expect(result).toEqual(associationLink);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockCreateAssociation.mockResolvedValueOnce(undefined);

            await expect(createAssociation(reqest, companyNumber))
                .rejects.toThrow(`Associations API for a company with company number ${companyNumber}, the associations API response was null, undefined or falsy.`);
        });

        it("should throw an error if status code other than 201", async () => {
            const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
            mockCreateAssociation.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<Errors>);
            const expectedError = createError(HTTP_STATUS_CODE, `"No error list returned" Http status code ${HTTP_STATUS_CODE} - Failed to create association for a company with company number ${companyNumber}`);

            await expect(createAssociation(reqest, companyNumber))
                .rejects.toEqual(expectedError);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.CREATED;
            mockCreateAssociation.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<NewAssociationResponse>);

            await expect(createAssociation(reqest, companyNumber))
                .rejects.toThrow(`Associations API returned no resource for creation of an association for a company with company number ${companyNumber}`);
        });
    });
});
