import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import logger from "../../lib/Logger";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getCompanyInvitationsDeclineFullUrl, getFullUrl } from "../../lib/utils/urlUtils";

export const companyInvitationsDeclineNavigation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const pageIndicator = false;
    const associationId = req.params[constants.ASSOCIATIONS_ID];
    const companyName = req.query[constants.COMPANY_NAME] as string;
    const hrefB = `${getCompanyInvitationsDeclineFullUrl(associationId)}?${constants.COMPANY_NAME}=${(companyName.replace(/ /g, "+")).replace("'", "%27")}`;

    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    logger.debug(`companyInvitationsDeclineNavigation: request to ${req.originalUrl}, calling redirectPage fn`);

    if (redirectPage(referrer, getFullUrl(constants.COMPANY_INVITATIONS_URL), hrefB, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        next();
    }
};
