import * as constants from "../../constants";
import { Removal } from "../../types/removal";
import logger from "../../lib/Logger";

/**
 * Validates the removal association request.
 *
 * @param removal - The removal object containing details of the removal request.
 * @param companyNumber - The company number to validate against the removal object.
 * @returns A boolean indicating whether the removal request is valid.
 */
export const validateRemoveAssociation = (removal: Removal, companyNumber: string): boolean => {
    // Check if the removal object exists
    if (!removal) {
        logger.info(`removal request invalid: removal object not found in session`);
        return false;
    }

    // Check if the removal request has been confirmed
    if (removal.removePerson !== constants.CONFIRM) {
        logger.info(`removal request invalid: removePerson status not confirmed`);
        return false;
    }

    // Check if the company number in the removal object matches the provided company number
    if (removal.companyNumber !== companyNumber) {
        logger.info(`removal request invalid: company number url param did not match the company number in removal`);
        return false;
    }

    // If all checks pass, the removal request is valid
    return true;
};
