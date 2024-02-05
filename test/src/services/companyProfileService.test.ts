import { createApiClient, Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../../src/services/companyProfileService";
import { validSDKResource } from "../../mocks/companyProfileMock";
import { StatusCodes } from "http-status-codes";

jest.mock("@companieshouse/api-sdk-node");
jest.mock("../../../src/lib/Logger");

const mockCreateApiClient = createApiClient as jest.Mock;
const mockGetCompanyProfile = jest.fn();

mockCreateApiClient.mockReturnValue({
    companyProfile: {
        getCompanyProfile: mockGetCompanyProfile
    }
});

const clone = (objectToClone: any): any => {
    return JSON.parse(JSON.stringify(objectToClone));
};

const COMPANY_NUMBER = "12345678";

describe("Company profile service test", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getCompanyProfile tests", () => {
        it("Should return a company profile", async () => {
            mockGetCompanyProfile.mockResolvedValueOnce(clone(validSDKResource));

            await getCompanyProfile(COMPANY_NUMBER).then((returnedProfile) => {
                Object.getOwnPropertyNames(validSDKResource.resource).forEach(property => {
                    expect(returnedProfile).toHaveProperty(property);
                });
            });
        });

        it("Should return an error if no response returned from SDK", async () => {
            mockGetCompanyProfile.mockResolvedValueOnce(undefined);

            await expect(getCompanyProfile(COMPANY_NUMBER))
                .rejects.toBe(undefined);
        });

        it("Should throw an error if SERVICE UNAVAILABLE returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.SERVICE_UNAVAILABLE;
            mockGetCompanyProfile.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<CompanyProfile>);

            await expect(getCompanyProfile(COMPANY_NUMBER))
                .rejects.toEqual({ httpStatusCode: StatusCodes.SERVICE_UNAVAILABLE });
        });

        it(`Should throw an error if status code >= ${StatusCodes.BAD_REQUEST}`, async () => {
            const HTTP_STATUS_CODE = StatusCodes.BAD_REQUEST;
            mockGetCompanyProfile.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<CompanyProfile>);

            await expect(getCompanyProfile(COMPANY_NUMBER))
                .rejects.toEqual({ httpStatusCode: StatusCodes.BAD_REQUEST });
        });

        it("Should throw an error if no response resource returned from SDK", async () => {
            const HTTP_STATUS_CODE = StatusCodes.OK;
            mockGetCompanyProfile.mockResolvedValueOnce({
                httpStatusCode: HTTP_STATUS_CODE
            } as Resource<CompanyProfile>);

            await expect(getCompanyProfile(COMPANY_NUMBER))
                .rejects.toEqual({ httpStatusCode: StatusCodes.OK });
        });
    });
});
