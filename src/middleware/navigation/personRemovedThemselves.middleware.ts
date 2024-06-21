import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";

export const removedThemselvesNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const referrer: string | undefined = req.get("Referrer");
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const hrefA = getExtraData(req.session, constants.REMOVE_URL_EXTRA);

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    if (redirectPage(referrer, hrefA, constants.YOUR_COMPANIES_REMOVED_THEMSELVES_URL, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
