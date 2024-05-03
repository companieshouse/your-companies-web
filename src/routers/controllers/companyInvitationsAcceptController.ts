import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsAcceptHandler } from "../handlers/yourCompanies/companyInvitationsAcceptHandler";

export const companyInvitationsAcceptControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyInvitationsAcceptHandler();
    const viewData = await handler.execute(req);
    res.render(constants.COMPANY_INVITATIONS_ACCEPT_PAGE, {
        ...viewData
    });
};
