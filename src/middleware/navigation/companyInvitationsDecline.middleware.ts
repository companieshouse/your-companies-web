import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const companyInvitationsDeclineNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const associationId = req.params[constants.ASSOCIATIONS_ID];
    const companyName = req.query[constants.COMPANY_NAME] as string;
    const hrefB = `${constants.YOUR_COMPANIES_COMPANY_INVITATIONS_DECLINE_URL.replace(":associationId", associationId)}?${constants.COMPANY_NAME}=${companyName.replace(/ /g, "+")}`;

    if (redirectPage(referrer, constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL, hrefB, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
