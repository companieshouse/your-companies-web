import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsDeclineHandler } from "../handlers/yourCompanies/companyInvitationsDeclineHandler";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";

/**
 * Handles the GET request for declining company invitations.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const companyInvitationsDeclineControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyInvitationsDeclineHandler();
    const viewData = await handler.execute(req);

    if (viewData.associationStateChanged) {
        deleteExtraData(req.session, viewData.associationStateChanged);
        return res.redirect(getFullUrl(constants.COMPANY_INVITATIONS_URL));
    }

    res.render(constants.COMPANY_INVITATIONS_DECLINE_PAGE, {
        ...viewData
    });
};
