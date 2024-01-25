import { Request, Response, Router, NextFunction } from "express";
import { YourCompaniesHandler } from "./handlers/yourCompanies/yourCompanies";
import { ConfirmCorrectCompany } from "./handlers/confirmCorrectCompany";
import * as constants from "../constants";
import logger from "../lib/Logger";

const router: Router = Router();
const routeViews: string = "router_views/your_companies";

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req, res);
    res.render(`${routeViews}/your_companies`, {
        ...viewData,
        ...req.t("your-companies", { returnObjects: true })
    });
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
