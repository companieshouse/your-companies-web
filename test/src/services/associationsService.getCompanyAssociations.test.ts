import { Resource } from "@companieshouse/api-sdk-node";
import { createOauthPrivateApiClient } from "../../../src/services/apiClientService";
import { getCompanyAssociations } from "../../../src/services/associationsService";
import { Associations } from "@companieshouse/private-api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { userAssociations } from "../../mocks/associations.mock";
import { Request } from "express";
jest.mock("../../../src/services/apiClientService");

const mockCreateOauthPrivateApiClient = createOauthPrivateApiClient as jest.Mock;
const mockGetCompanyAssociations = jest.fn();

mockCreateOauthPrivateApiClient.mockReturnValue({
    associationsService: {
        getCompanyAssociations: mockGetCompanyAssociations
    }
});

const reqest = {} as Request;
const companyNumber = "NI038379";

describe("associationsService", () => {
    describe("getCompanyAssociations", () => {

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return associations", async () => {
            // Given
            const sdkResource: Resource<Associations> = {
                httpStatusCode: StatusCodes.OK,
                resource: userAssociations
            };
            mockGetCompanyAssociations.mockResolvedValueOnce(sdkResource);
            // When
            const result = await getCompanyAssociations(reqest, companyNumber);
            // Then
            expect(result).toEqual(sdkResource.resource);
        });

        it("should return an error if no response returned from SDK", async () => {
            mockGetCompanyAssociations.mockResolvedValueOnce(undefined);

            await expect(getCompanyAssociations(reqest, companyNumber))
                .rejects.toBe(undefined);
        });

        it("should throw an error if status code other than 200", async () => {
            const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
            mockGetCompanyAssociations.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<Associations>);

            await expect(getCompanyAssociations(reqest, companyNumber))
                .rejects.toEqual({ httpStatusCode: StatusCodes.BAD_REQUEST });
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.OK;
            mockGetCompanyAssociations.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<Associations>);

            await expect(getCompanyAssociations(reqest, companyNumber))
                .rejects.toEqual({ httpStatusCode: StatusCodes.OK });
        });
    });
});
