import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const removedThemselvesNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const referrer: string | undefined = req.get("Referrer");
    const pageIndicator = false;
    const hrefA = getExtraData(req.session, constants.REMOVE_URL_EXTRA);

    if (redirectPage(referrer, hrefA, constants.YOUR_COMPANIES_REMOVED_THEMSELVES_URL, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};