import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";

export const manageAuthorisedPeopleNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const cancelPageUrl = getExtraData(req.session, constants.CANCEL_URL_EXTRA);
    const removePageUrl = getExtraData(req.session, constants.REMOVE_URL_EXTRA);
    const manageAuthUrl = constants.MANAGE_AUTHORISED_PEOPLE_URL.replace(":companyNumber", companyNumber);

    logger.debug(`manageAuthorisedPeopleNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (req.originalUrl.includes(constants.CONFIRMATION_PERSON_ADDED) &&
        redirectPage(referrer,
            constants.YOUR_COMPANIES_CHECK_PRESENTER_URL.replace(":companyNumber", companyNumber),
            constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(":companyNumber", companyNumber), pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else if (req.originalUrl.includes(constants.CONFIRMATION_PERSON_REMOVED_URL) &&
        redirectPage(referrer, removePageUrl, constants.CONFIRMATION_PERSON_REMOVED_URL, pageIndicator)) {
        deleteExtraData(req.session, constants.REMOVE_URL_EXTRA);
        res.redirect(constants.LANDING_URL);
    } else if (req.originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL) &&
        redirectPage(referrer, cancelPageUrl, constants.CONFIRMATION_CANCEL_PERSON_URL, pageIndicator)) {
        deleteExtraData(req.session, constants.CANCEL_URL_EXTRA);
        res.redirect(constants.LANDING_URL);
    } else if (req.originalUrl.includes(constants.AUTHORISATION_EMAIL_RESENT_URL) &&
        redirectPage(referrer, manageAuthUrl, constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
