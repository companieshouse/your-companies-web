import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../../src/services/apiClientService";
import { createAssociation } from "../../../../src/services/associationsService";
import { Errors, NewAssociationResponse } from "private-api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import createError from "http-errors";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockCreateAssociation = jest.fn();

mockCreateOauthPrivateApiClient.mockReturnValue({
    associationsService: {
        createAssociation: mockCreateAssociation
    }
});

const reqest = {} as Request;
const companyNumber = "AB123456";
const inviteeEmailAddress = "eva.brown@test.com";

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

        it("should return a new association link when the association for invited person is created", async () => {
            // Given
            const associationLink = "/associations/0123456789";
            const newAssociationResponse: NewAssociationResponse = { associationLink };
            const sdkResource: Resource<NewAssociationResponse> = {
                httpStatusCode: StatusCodes.CREATED,
                resource: newAssociationResponse
            };
            mockCreateAssociation.mockResolvedValue(sdkResource);
            // When
            const result = await createAssociation(reqest, companyNumber, inviteeEmailAddress);
            // Then
            expect(result).toEqual(associationLink);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockCreateAssociation.mockResolvedValueOnce(undefined);

            await expect(createAssociation(reqest, companyNumber))
                .rejects.toThrow(`Associations API for a company with company number ${companyNumber}, the associations API response was null, undefined or falsy.`);
        });

        it("should return an error if no response returned from SDK for invited person", async () => {
            mockCreateAssociation.mockResolvedValueOnce(undefined);

            await expect(createAssociation(reqest, companyNumber, inviteeEmailAddress))
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

        it("should throw an error if status code other than 201 for invited person", async () => {
            const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
            const expectedError = createError(HTTP_STATUS_CODE, `"No error list returned" Http status code ${HTTP_STATUS_CODE} - Failed to create association for a company with company number ${companyNumber}`);

            mockCreateAssociation.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<Errors>);

            await expect(createAssociation(reqest, companyNumber, inviteeEmailAddress))
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

        it("Should throw an error if no response resource returned from SDK for invited person", async () => {
            const HTTP_STATUS_CODE = StatusCodes.CREATED;
            mockCreateAssociation.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<NewAssociationResponse>);

            await expect(createAssociation(reqest, companyNumber, inviteeEmailAddress))
                .rejects.toThrow(`Associations API returned no resource for creation of an association for a company with company number ${companyNumber}`);
        });
    });
});
