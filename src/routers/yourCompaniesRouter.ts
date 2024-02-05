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
import { createTransaction } from "./controllers/createTransaction";
import { confirmCompanyGet, confirmCompanyPost } from "./controllers/confirmCompany";
import { companyAdded } from "./controllers/companyAdded";
import * as constants from "../constants";

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

router.get(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyGet);

router.post(constants.CONFIRM_COMPANY_DETAILS_URL, confirmCompanyPost);

router.get(constants.CREATE_TRANSACTION_PATH, createTransaction);

router.get(constants.COMPANY_ADDED_SUCCESS_URL, companyAdded);

export default router;
