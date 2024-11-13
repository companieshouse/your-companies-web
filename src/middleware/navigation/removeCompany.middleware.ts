import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { setExtraData } from "../../lib/utils/sessionUtils";

export const removeCompanyNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = constants.LANDING_URL;
    const companyNumber = req.params[constants.COMPANY_NUMBER];

    const removeCompanyUrl = constants.REMOVE_COMPANY_URL.replace(":companyNumber", companyNumber);

    setExtraData(req.session, constants.REMOVE_COMPANY_URL_EXTRA, removeCompanyUrl);

    if (redirectPage(referrer, hrefA, removeCompanyUrl, false)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
