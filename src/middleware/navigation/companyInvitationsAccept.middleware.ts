import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const companyInvitationsAcceptNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const pageIndicator = false;
    const associationId = req.params[constants.ASSOCIATIONS_ID];
    const companyName = req.query[constants.COMPANY_NAME] as string;
    const hrefB = `${constants.YOUR_COMPANIES_COMPANY_INVITATIONS_ACCEPT_URL.replace(":associationId", associationId)}?${constants.COMPANY_NAME}=${companyName.replace(/ /g, "+")}`;

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(`companyInvitationsAcceptNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(referrer, constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL, hrefB, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
