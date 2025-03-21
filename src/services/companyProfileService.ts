import { createApiClient, Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import { CHS_API_KEY } from "../constants";

/**
 * Get the profile for a company.
 *
 * @param companyNumber the company number to look up
 */
export const getCompanyProfile = async (companyNumber: string): Promise<CompanyProfile> => {
    const apiClient = createApiClient(CHS_API_KEY);

    logger.info(`Looking for company profile with company number ${companyNumber}`);
    const sdkResponse: Resource<CompanyProfile> = await apiClient.companyProfile.getCompanyProfile(companyNumber);

    if (!sdkResponse) {
        const errorMessage = `Company profile API for company number ${companyNumber}`;
        logger.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to get company profile for company number ${companyNumber}`;
        logger.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
    }

    if (!sdkResponse.resource) {
        const errorMessage = `Company profile API returned no resource for company number ${companyNumber}`;
        logger.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
    }

    logger.debug(`Received company profile ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource);
};
