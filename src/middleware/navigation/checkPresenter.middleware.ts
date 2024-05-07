import { NextFunction, Request, RequestHandler, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";

export const checkPresenterNavigation: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(`checkPresenterNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(referrer, constants.ADD_PRESENTER_URL.replace(":companyNumber", companyNumber),
        constants.CHECK_PRESENTER_URL.replace(":companyNumber", companyNumber), pageIndicator,
        constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(":companyNumber", companyNumber))) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
