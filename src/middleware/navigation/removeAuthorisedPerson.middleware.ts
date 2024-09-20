import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";
import { isReferrerIncludes } from "../../lib/utils/urlUtils";

export const removeAuthorisedPersonNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const userEmail = req.params[constants.USER_EMAIL];
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const removePageUrl = (constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL.replace(":companyNumber", companyNumber)).replace(":userEmail", userEmail);
    const userEmails = getExtraData(req.session, constants.USER_EMAILS_ARRAY);

    let checkedReferrer;
    let newPageIndicator;

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

    setExtraData(req.session, constants.REMOVE_URL_EXTRA, removePageUrl);

    logger.debug(`removeAuthorisedPersonNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(checkedReferrer, hrefA, constants.AUTHENTICATION_CODE_REMOVE_URL.replace(":userEmail", userEmail), newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
