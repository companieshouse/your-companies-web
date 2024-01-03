import { Request, Response, Router, NextFunction } from "express";
import { YourCompaniesHandler } from "./handlers/yourCompanies/yourCompanies";

const router: Router = Router();
const routeViews: string = "router_views/your_companies";

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req, res);
    res.render(`${routeViews}/your_companies`, viewData);
});

export default router;
