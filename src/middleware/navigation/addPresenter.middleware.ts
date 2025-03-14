import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";
import {
    getAddPresenterUrl,
    getCheckPresenterUrl,
    isReferrerIncludes
} from "../../lib/utils/urlUtils";

export const addPresenterNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    let checkedReferrer;

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    deleteExtraData(req.session, constants.USER_EMAILS_ARRAY);

    if (referrer && isReferrerIncludes(referrer)) {
        checkedReferrer = hrefA;
    } else {
        checkedReferrer = referrer;
    }
    logger.debug(`addPresenterNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(checkedReferrer, hrefA, getAddPresenterUrl(companyNumber), pageIndicator, [getCheckPresenterUrl(companyNumber)])) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
