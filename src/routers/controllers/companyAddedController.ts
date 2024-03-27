import { Request, Response } from "express";
import { CompanyAddSuccessHandler } from "../handlers/yourCompanies/companyAddSuccessHandler";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const companyAddedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const referrer :string|undefined = req.get("Referrer");

    if (redirectPage(referrer, constants.CONFIRM_COMPANY_DETAILS_URL, constants.COMPANY_ADDED_SUCCESS_URL)) {
        res.redirect(constants.LANDING_URL);
    } else {
        const viewData = await new CompanyAddSuccessHandler().execute(req);
        res.render(constants.COMPANY_ADD_SUCCESS_PAGE, viewData);

    }
};
