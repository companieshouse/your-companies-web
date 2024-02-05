import { Request, Response, Router, NextFunction } from "express";
import { YourCompaniesHandler } from "../handlers/yourCompanies/yourCompanies";
import { YOUR_COMPANIES_PAGE_TEMPLATE } from "../../constants";

export const yourCompaniesControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req, res);
    res.render(YOUR_COMPANIES_PAGE_TEMPLATE, {
        ...viewData
    });
};
