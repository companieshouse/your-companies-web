import { Request, Response } from "express";
import { CompanyAddSuccessHandler } from "../handlers/yourCompanies/companyAddSuccessHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const companyAddedControllerGet = async (req: Request, res: Response): Promise<void> => {

    deleteExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
    const viewData = await new CompanyAddSuccessHandler().execute(req);
    res.render(constants.COMPANY_ADD_SUCCESS_PAGE, viewData);
};
