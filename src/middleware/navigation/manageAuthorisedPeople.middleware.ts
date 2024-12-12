import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const manageAuthorisedPeopleNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const cancelPageUrl = getExtraData(req.session, constants.CANCEL_URL_EXTRA);
    const removePageUrl = getExtraData(req.session, constants.REMOVE_URL_EXTRA);
    const manageAuthUrl = constants.MANAGE_AUTHORISED_PEOPLE_URL.replace(":companyNumber", companyNumber);

    const allowedEmailResentUrls: string[] = [
        getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL).replace(":companyNumber", companyNumber),
        constants.CONFIRMATION_PERSON_REMOVED_URL,
        constants.CONFIRMATION_CANCEL_PERSON_URL
    ];

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(`manageAuthorisedPeopleNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (req.originalUrl.includes(constants.CONFIRMATION_PERSON_ADDED_URL) &&
        redirectPage(referrer,
            getFullUrl(constants.CHECK_PRESENTER_URL).replace(":companyNumber", companyNumber),
            getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL).replace(":companyNumber", companyNumber), pageIndicator)) {
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

        redirectPage(referrer, manageAuthUrl, constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL.replace(":companyNumber", companyNumber), pageIndicator, allowedEmailResentUrls)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
