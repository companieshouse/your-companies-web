import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const removeAuthorisedPersonNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const userEmail = req.params[constants.USER_EMAIL];
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const removePageUrl = (constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL.replace(":companyNumber", companyNumber)).replace(":userEmail", userEmail);

    let checkedReferrer;
    let newPageIndicator;

    if (referrer && (referrer.includes("confirmation-person-removed") || referrer.includes("confirmation-cancel-person") || referrer.includes("confirmation-person-added"))) {
        checkedReferrer = hrefA;
    } else {
        checkedReferrer = referrer;
    }

    if (checkedReferrer?.includes("manage-authorised-people") && pageIndicator === true) {
        newPageIndicator = false;
    } else {
        newPageIndicator = pageIndicator;
    }

    setExtraData(req.session, constants.REMOVE_URL_EXTRA, removePageUrl);

    if (redirectPage(checkedReferrer, hrefA, constants.AUTHENTICATION_CODE_REMOVE_URL.replace(":userEmail", userEmail), newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};