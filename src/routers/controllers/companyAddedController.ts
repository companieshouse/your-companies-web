import { Request, Response } from "express";
import { CompanyAddSuccessHandler } from "../handlers/yourCompanies/companyAddSuccessHandler";
import * as constants from "../../constants";

export const companyAddedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await new CompanyAddSuccessHandler().execute(req);
    res.render(constants.COMPANY_ADD_SUCCESS_PAGE, viewData);
};
