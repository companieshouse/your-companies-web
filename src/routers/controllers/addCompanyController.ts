import { Request, Response, NextFunction } from "express";
import { AddCompanyHandler } from "../handlers/yourCompanies/addCompanyHandler";
import {
    ADD_COMPANY_PAGE,
    GET,
    POST,
    YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL
} from "../../constants";

export const addCompanyControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, GET);
    res.render(ADD_COMPANY_PAGE, {
        ...viewData
    });
};

export const addCompanyControllerPost = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(ADD_COMPANY_PAGE, {
            ...viewData
        });
    } else {
        res.redirect(YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL);
    }
};
