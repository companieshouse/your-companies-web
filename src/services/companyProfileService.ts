import { createApiClient, Resource } from "@companieshouse/api-sdk-node";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import { CHS_API_KEY } from "../constants";

/**
 * Retrieves the company profile for a given company number.
 *
 * This function uses an API client to fetch the company profile from an external service.
 * It performs several checks to ensure the response is valid and logs appropriate messages
 * for debugging and error handling.
 *
 * @param companyNumber - The unique identifier for the company whose profile is being retrieved.
 * @returns A promise that resolves to the `CompanyProfile` object if the operation is successful.
 * @throws An error if the API response is invalid, the HTTP status code is not OK, or the resource is missing.
 *
 * @example
 * ```typescript
 * try {
 *   const profile = await getCompanyProfile("12345678");
 *   console.log(profile);
 * } catch (error) {
 *   console.error("Failed to fetch company profile:", error);
 * }
 * ```
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
