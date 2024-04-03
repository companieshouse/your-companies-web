import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsHandler } from "../handlers/yourCompanies/companyInvitationsHandler";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const companyInvitationsControllerGet = async (req: Request, res: Response): Promise<void> => {

    const referrer :string|undefined = req.get("Referrer");

    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    if (redirectPage(referrer, constants.LANDING_URL, constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {

        const handler = new CompanyInvitationsHandler();
        const viewData = await handler.execute(req);
        res.render(constants.COMPANY_INVITATIONS_PAGE, {
            ...viewData
        });
    }
};
