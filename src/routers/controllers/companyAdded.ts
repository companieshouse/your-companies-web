import { Request, Response, NextFunction } from "express";
import { CompanyAddSuccess } from "../handlers/yourCompanies/companyAddSuccess";
import * as constants from "../../constants";

export const companyAdded = async (req: Request, res: Response, next: NextFunction) => {
    const viewData = await new CompanyAddSuccess().execute(req, res);
    res.render(constants.COMPANY_ADDED_SUCCESS_PAGE_TEMPLATE, viewData);
};
