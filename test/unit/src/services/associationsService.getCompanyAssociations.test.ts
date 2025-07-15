import { Resource } from "@companieshouse/api-sdk-node";
import { createOAuthApiClient } from "../../../../src/services/apiClientService";
import { getCompanyAssociations } from "../../../../src/services/associationsService";
import { AssociationList } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { StatusCodes } from "http-status-codes";
import { userAssociations } from "../../../mocks/associations.mock";
import { Request } from "express";
import { HttpError } from "http-errors";

jest.mock("../../../../src/services/apiClientService");
jest.mock("../../../../src/lib/Logger");

const mockCreateOauthApiClient = createOAuthApiClient as jest.Mock;
const mockGetCompanyAssociations = jest.fn();

mockCreateOauthApiClient.mockReturnValue({
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
            const sdkResource: Resource<AssociationList> = {
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
                .rejects.toThrow(`Associations API for a company with company number ${companyNumber}`);
        });

        it("should throw an error if status code other than 200", async () => {
            const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
            mockGetCompanyAssociations.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<AssociationList>);

            await expect(getCompanyAssociations(reqest, companyNumber))
                .rejects.toThrow(HttpError);
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.OK;
            mockGetCompanyAssociations.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<AssociationList>);

            await expect(getCompanyAssociations(reqest, companyNumber))
                .rejects.toThrow(`Associations API returned no resource for associations for a company with company number ${companyNumber}`);
        });
    });
});
