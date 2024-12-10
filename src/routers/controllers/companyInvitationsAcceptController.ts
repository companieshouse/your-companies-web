import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsAcceptHandler } from "../handlers/yourCompanies/companyInvitationsAcceptHandler";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const companyInvitationsAcceptControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyInvitationsAcceptHandler();
    const viewData = await handler.execute(req);
    if (viewData.associationStateChanged) {
        deleteExtraData(req.session, viewData.associationStateChanged as string);
        res.redirect(getFullUrl(constants.COMPANY_INVITATIONS_URL));
    } else {
        res.render(constants.COMPANY_INVITATIONS_ACCEPT_PAGE, {
            ...viewData
        });
    }
};
