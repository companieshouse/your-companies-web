import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const confirmCompanyNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const pageIndicator = false;

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    deleteExtraData(req.session, constants.CURRENT_COMPANY_NUM);

    logger.debug(`confirmCompanyNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(referrer, constants.ADD_COMPANY_URL, constants.CONFIRM_COMPANY_DETAILS_URL, pageIndicator, [constants.COMPANY_ADDED_SUCCESS_URL])) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
