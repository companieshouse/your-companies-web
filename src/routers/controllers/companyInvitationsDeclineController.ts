import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsDeclineHandler } from "../handlers/yourCompanies/companyInvitationsDeclineHandler";

export const companyInvitationsDeclineControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyInvitationsDeclineHandler();
    const viewData = await handler.execute(req);
    res.render(constants.COMPANY_INVITATIONS_DECLINE_PAGE, {
        ...viewData
    });
};
