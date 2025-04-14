import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsAcceptHandler } from "../handlers/yourCompanies/companyInvitationsAcceptHandler";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";

/**
 * Handles the GET request for accepting company invitations.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const companyInvitationsAcceptControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyInvitationsAcceptHandler();
    const viewData = await handler.execute(req);

    if (viewData.associationStateChanged) {
        deleteExtraData(req.session, viewData.associationStateChanged);
        return res.redirect(getFullUrl(constants.COMPANY_INVITATIONS_URL));

    }

    res.render(constants.COMPANY_INVITATIONS_ACCEPT_PAGE, { ...viewData });
};
