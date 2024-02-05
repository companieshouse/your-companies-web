import { Request, Response, NextFunction } from "express";
import { CompanyAddSuccess } from "../handlers/yourCompanies/companyAddSuccess";
import * as constants from "../../constants";
import logger from "../../lib/Logger";

export const companyAdded = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debug("rendering SUCCCESS page to " + constants.COMPANY_ADDED_SUCCESS_PAGE_TEMPLATE);
        const viewData = await new CompanyAddSuccess().execute(req, res);
        res.render(constants.COMPANY_ADDED_SUCCESS_PAGE_TEMPLATE, viewData);
    } catch (e) {
        return next(e);
    }
};
