import * as constants from "../../constants";
import { Removal } from "../../types/removal";
import logger from "../../lib/Logger";

/**
 * Validates the removal association request by checking the provided removal object
 * and ensuring it meets the required conditions.
 *
 * @param removal - The removal object containing details about the removal request.
 * @param companyNumber - The company number to validate against the removal object.
 * @returns A boolean indicating whether the removal request is valid.
 */
export const validateRemoveAssociation = (removal: Removal, companyNumber: string): boolean => {
    if (!removal) {
        logger.info(`removal request invalid: removal object not found in session`);
        return false;
    }

    if (removal.removePerson !== constants.CONFIRM) {
        logger.info(`removal request invalid: removePerson status not confirmed`);
        return false;
    }

    if (removal.companyNumber !== companyNumber) {
        logger.info(`removal request invalid: company number url param did not match the company number in removal`);
        return false;
    }

    return true;
};
