import { Request, Response } from "express";
import { CompanyAddSuccessHandler } from "../handlers/yourCompanies/companyAddSuccessHandler";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";

export const companyAddedControllerGet = async (req: Request, res: Response): Promise<void> => {

    const referrer :string|undefined = req.get("Referrer");
    const companyDetailsIndicator = getExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);

    if (redirectPage(referrer, constants.CONFIRM_COMPANY_DETAILS_URL, constants.COMPANY_ADDED_SUCCESS_URL, companyDetailsIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {

        deleteExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);

        const viewData = await new CompanyAddSuccessHandler().execute(req);
        res.render(constants.COMPANY_ADD_SUCCESS_PAGE, viewData);
    }
};
