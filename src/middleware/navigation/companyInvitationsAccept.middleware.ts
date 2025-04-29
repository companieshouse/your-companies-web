import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getCompanyInvitationsAcceptFullUrl, getFullUrl } from "../../lib/utils/urlUtils";

/**
 * Middleware to handle navigation for accepting company invitations.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 */
export const companyInvitationsAcceptNavigation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const referrer = req.get("Referrer");
    const pageIndicator = false;
    const associationId = req.params[constants.ASSOCIATIONS_ID];
    const companyName = req.query[constants.COMPANY_NAME] as string;
    const formattedCompanyName = encodeURIComponent(companyName.replace(/ /g, "+"));
    const targetUrl = `${getCompanyInvitationsAcceptFullUrl(associationId)}?${constants.COMPANY_NAME}=${formattedCompanyName}`;

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(createLogMessage(req.session, companyInvitationsAcceptNavigation.name, `request to ${req.originalUrl}, calling redirectPage fn`));

    if (redirectPage(referrer, getFullUrl(constants.COMPANY_INVITATIONS_URL), targetUrl, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
