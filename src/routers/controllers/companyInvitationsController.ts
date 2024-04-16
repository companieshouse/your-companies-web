import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsHandler } from "../handlers/yourCompanies/companyInvitationsHandler";

export const companyInvitationsControllerGet = async (req: Request, res: Response): Promise<void> => {
    console.time("companyInvitationsControllerGet");

    const handler = new CompanyInvitationsHandler();
    const viewData = await handler.execute(req);
    res.render(constants.COMPANY_INVITATIONS_PAGE, {
        ...viewData
    });
    console.timeEnd("companyInvitationsControllerGet");

};
