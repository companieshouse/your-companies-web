import { Request, Response, NextFunction } from "express";
import { CompanyAddSuccessHandler } from "../handlers/yourCompanies/companyAddSuccessHandler";
import * as constants from "../../constants";

export const companyAddedControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const viewData = await new CompanyAddSuccessHandler().execute(req, res);
    res.render(constants.COMPANY_ADD_SUCCESS_PAGE, viewData);
};
