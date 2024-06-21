import { NextFunction, Request, RequestHandler, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";

export const presenterAlreadyAddedNavigation: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(`presenterAlreadyAddedNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(referrer, constants.CHECK_PRESENTER_URL.replace(":companyNumber", companyNumber),
        constants.PRESENTER_ALREADY_ADDED_URL.replace(":companyNumber", companyNumber), pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
