import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";
import {
    getAddPresenterUrl,
    getAuthorisedPersonAddedFullUrl,
    getCheckPresenterUrl,
    getPresenterAlreadyAddedUrl
} from "../../lib/utils/urlUtils";

export const checkPresenterNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const hrefC = [getAuthorisedPersonAddedFullUrl(companyNumber), getPresenterAlreadyAddedUrl(companyNumber)];

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(`checkPresenterNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(referrer, getAddPresenterUrl(companyNumber),
        getCheckPresenterUrl(companyNumber), pageIndicator,
        hrefC)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
