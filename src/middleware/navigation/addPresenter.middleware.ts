import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";

export const addPresenterNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    let checkedReferrer;

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    deleteExtraData(req.session, constants.USER_EMAILS_ARRAY);

    if (referrer && (referrer.includes("confirmation-person-removed") ||
        referrer.includes("confirmation-cancel-person") ||
        referrer.includes("confirmation-person-added") ||
        referrer.includes("authorisation-email-resent"))) {
        checkedReferrer = hrefA;
    } else {
        checkedReferrer = referrer;
    }
    logger.debug(`addPresenterNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(checkedReferrer, hrefA, constants.ADD_PRESENTER_URL.replace(":companyNumber", companyNumber), pageIndicator, [constants.CHECK_PRESENTER_URL.replace(":companyNumber", companyNumber)])) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
