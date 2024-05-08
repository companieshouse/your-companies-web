import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsDeclineHandler } from "../handlers/yourCompanies/companyInvitationsDeclineHandler";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const companyInvitationsDeclineControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyInvitationsDeclineHandler();
    const viewData = await handler.execute(req);
    if (viewData.associationStateChanged) {
        deleteExtraData(req.session, viewData.associationStateChanged as string);
        res.redirect(constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL);
    } else {
        res.render(constants.COMPANY_INVITATIONS_DECLINE_PAGE, {
            ...viewData
        });
    }
};
