import { Request, Response, Router, NextFunction } from "express";
import { YourCompaniesHandler } from "./handlers/yourCompanies/yourCompanies";
import { ConfirmCorrectCompany } from "./handlers/confirmCorrectCompany";

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

router.get("/confirm-company-details", async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ConfirmCorrectCompany();
    const viewData = await handler.execute(req, res);
    res.render(`${routeViews}/confirm-company-details`, {
        ...viewData,
        ...req.t("confirm-company-details", { returnObjects: true })
    });
});

export default router;
