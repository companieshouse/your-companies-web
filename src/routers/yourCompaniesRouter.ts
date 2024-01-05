import { Request, Response, Router, NextFunction } from "express";
import { YourCompaniesHandler } from "./handlers/yourCompanies/yourCompanies";
import { YOUR_COMPANIES_LANG, YOUR_COMPANIES_PAGE_TEMPLATE, YOUR_COMPANIES_URL } from "../constants";

const router: Router = Router();

router.get(YOUR_COMPANIES_URL, async (req: Request, res: Response, next: NextFunction) => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req, res);
    res.render(YOUR_COMPANIES_PAGE_TEMPLATE, {
        ...viewData,
        ...req.t(YOUR_COMPANIES_LANG, { returnObjects: true })
    });
});

export default router;
