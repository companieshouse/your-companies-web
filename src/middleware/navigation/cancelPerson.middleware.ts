import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";

export const cancelPersonNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const userEmail = req.params[constants.USER_EMAIL];
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const cancelPageUrl = (constants.YOUR_COMPANIES_COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL.replace(":companyNumber", companyNumber)).replace(":userEmail", userEmail);
    let checkedReferrer;
    let newPageIndicator;

    setExtraData(req.session, constants.CANCEL_URL_EXTRA, cancelPageUrl);

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

    if (redirectPage(checkedReferrer, hrefA, constants.CANCEL_PERSON_URL.replace(":userEmail", userEmail), newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
