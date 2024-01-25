import { Request, Response, Router, NextFunction } from "express";
import { YourCompaniesHandler } from "./handlers/yourCompanies/yourCompanies";
import {
    ADD_COMPANY_PAGE_TEMPLATE,
    ADD_COMPANY_URL,
    GET,
    POST,
    YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL,
    YOUR_COMPANIES_PAGE_TEMPLATE,
    YOUR_COMPANIES_URL
} from "../constants";
import { AddCompanyHandler } from "./handlers/yourCompanies/addCompany";
import { ConfirmCorrectCompany } from "./handlers/confirmCorrectCompany";
import * as constants from "../constants";
import logger from "../lib/Logger";

const router: Router = Router();

router.get(YOUR_COMPANIES_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req, res);
    res.render(YOUR_COMPANIES_PAGE_TEMPLATE, {
        ...viewData
    });
});

router.get(ADD_COMPANY_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, GET);
    res.render(ADD_COMPANY_PAGE_TEMPLATE, {
        ...viewData
    });
});

router.post(ADD_COMPANY_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, POST);
    if (Object.keys(viewData.errors).length === 0) {
        res.redirect(YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL);
    } else {
        res.render(ADD_COMPANY_PAGE_TEMPLATE, {
            ...viewData
        });
    }
});

router.get(constants.CONFIRM_COMPANY_DETAILS_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ConfirmCorrectCompany();
    const viewData = await handler.execute(req, res);
    res.render(constants.CONFIRM_COMPANY_PAGE_TEMPLATE, viewData);
});

router.post(constants.CONFIRM_COMPANY_DETAILS_URL, async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.debugRequest(req, `${req.method} ${req.route.path}`);
        return res.redirect(constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL);
    } catch (errors) {
        // todo: add error handler
        logger.errorRequest(req, errors as string);
        next(errors);
    }
});

router.get(constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL, async (req: Request, res: Response, next: NextFunction) => {
    res.render(constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL);
});

export default router;
