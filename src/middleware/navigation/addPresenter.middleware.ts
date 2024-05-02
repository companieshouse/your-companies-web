import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const addPresenterNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    let checkedReferrer;
    let newPageIndicator;

    if (pageIndicator === true) {
        deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        newPageIndicator = false;
    } else {
        newPageIndicator = false;
    }

    if (referrer && (referrer.includes("confirmation-person-removed") || referrer.includes("confirmation-cancel-person") || referrer.includes("confirmation-person-added"))) {
        checkedReferrer = hrefA;
    } else {
        checkedReferrer = referrer;
    }

    if (redirectPage(checkedReferrer, hrefA, constants.ADD_PRESENTER_URL.replace(":companyNumber", companyNumber), newPageIndicator, constants.CHECK_PRESENTER_URL.replace(":companyNumber", companyNumber))) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
