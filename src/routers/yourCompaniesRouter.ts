import { Request, Response, Router, NextFunction } from "express";
import { YourCompaniesHandler } from "./handlers/yourCompanies/yourCompanies";
import {
    ADD_COMPANY_LANG,
    ADD_COMPANY_PAGE_TEMPLATE,
    ADD_COMPANY_URL,
    GET,
    POST,
    YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL,
    YOUR_COMPANIES_LANG,
    YOUR_COMPANIES_PAGE_TEMPLATE,
    YOUR_COMPANIES_URL
} from "../constants";
import { AddCompanyHandler } from "./handlers/yourCompanies/addCompany";

const router: Router = Router();

router.get(YOUR_COMPANIES_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req, res);
    res.render(YOUR_COMPANIES_PAGE_TEMPLATE, {
        ...viewData,
        ...req.t(YOUR_COMPANIES_LANG, { returnObjects: true })
    });
});

router.get(ADD_COMPANY_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, GET);
    res.render(ADD_COMPANY_PAGE_TEMPLATE, {
        ...viewData,
        ...req.t(ADD_COMPANY_LANG, { returnObjects: true })
    });
});

router.post(ADD_COMPANY_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, POST);
    res.redirect(YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL);
});

export default router;
