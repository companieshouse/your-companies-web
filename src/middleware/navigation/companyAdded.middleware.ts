import { Request, Response, NextFunction } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const companyAddedNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const referrer: string | undefined = req.get("Referrer");
    const companyDetailsIndicator = getExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);

    logger.debug(`companyAddedNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(referrer, getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL), constants.COMPANY_ADDED_SUCCESS_URL, companyDetailsIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
