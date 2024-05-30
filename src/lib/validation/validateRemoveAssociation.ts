import * as constants from "../../constants";
import { Removal } from "../../types/removal";
import logger from "../../lib/Logger";

export const validateRemoveAssociation = (removal:Removal, companyNumber:string):boolean => {
    if (!removal) {
        logger.info(`removal request invalid: removal object not found in session`);
        return false;
    }
    if (removal?.removePerson !== constants.CONFIRM) {
        logger.info(`removal request invalid: removePerson status not confirmed`);
        return false;
    }
    if (removal.companyNumber !== companyNumber) {
        logger.info(`removal request invalid: company number url param did not match the company number in removal`);
        return false;
    }
    return true;
};
