import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { deleteExtraData, getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";
import { getFullUrl, isReferrerIncludes } from "../../lib/utils/urlUtils";

export const cancelPersonNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const userEmail = req.params[constants.USER_EMAIL];
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const cancelPageUrl = (getFullUrl(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL).replace(":companyNumber", companyNumber)).replace(":userEmail", userEmail);
    const userEmails = getExtraData(req.session, constants.USER_EMAILS_ARRAY);

    let checkedReferrer;
    let newPageIndicator;

    setExtraData(req.session, constants.CANCEL_URL_EXTRA, cancelPageUrl);

    if (referrer && isReferrerIncludes(referrer)) {
        checkedReferrer = hrefA;
    } else {
        checkedReferrer = referrer;
    }

    if (companyNumber === pageIndicator && userEmails.includes(userEmail)) {
        newPageIndicator = true;
    } else {
        deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        newPageIndicator = pageIndicator;
    }

    logger.debug(`cancelPersonNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(checkedReferrer, hrefA, constants.CANCEL_PERSON_URL.replace(":userEmail", userEmail), newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
