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
import { ConfirmCorrectCompany } from "./handlers/yourCompanies/confirmCorrectCompany";
import * as constants from "../constants";
import logger from "../lib/Logger";
import { CompanyAddSuccess } from "./handlers/yourCompanies/companyAddSuccess";
import { setExtraData } from "../lib/utils/sessionUtils";

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
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(ADD_COMPANY_PAGE_TEMPLATE, {
            ...viewData
        });
    } else {
        res.redirect(YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL);
    }
});

router.get(constants.CONFIRM_COMPANY_DETAILS_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ConfirmCorrectCompany();
    const viewData = await handler.execute(req, res);
    res.render(constants.CONFIRM_COMPANY_PAGE_TEMPLATE, viewData);
});

router.post(constants.CONFIRM_COMPANY_DETAILS_URL, async (req: Request, res: Response, next: NextFunction) => {
    logger.debugRequest(req, `${req.method} ${req.route.path}`);
    // get the company number from profile in session
    const companyNum = await new ConfirmCorrectCompany().post(req, res);
    // set the company number to company number in session
    // this number is used by company auth for authenticaion of user + company
    console.log("THIS IS THE company number ", companyNum);
    setExtraData(req.session, constants.COMPANY_NUMBER, companyNum);
    logger.debug("redirect to " + constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL);
    return res.redirect(constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL);

});

router.get(constants.COMPANY_ADDED_SUCCESS_URL, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("rendering page to " + constants.COMPANY_ADDED_SUCCESS_PAGE_TEMPLATE);
    const viewData = await new CompanyAddSuccess().execute(req, res);
    res.render(constants.COMPANY_ADDED_SUCCESS_PAGE_TEMPLATE, viewData);
});

router.get(constants.COMPANY_ADDED_LIST, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug("rendering page to list of companies added");
    res.render(constants.COMPANY_ADDED_LIST_PAGE_TEMPLATE);
});

export default router;
