import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsAcceptHandler } from "../handlers/yourCompanies/companyInvitationsAcceptHandler";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const companyInvitationsAcceptControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyInvitationsAcceptHandler();
    const viewData = await handler.execute(req);
    if (viewData.associationStateChanged) {
        deleteExtraData(req.session, viewData.associationStateChanged as string);
        res.redirect(constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL);
    } else {
        res.render(constants.COMPANY_INVITATIONS_ACCEPT_PAGE, {
            ...viewData
        });
    }
};
