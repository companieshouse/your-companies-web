// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import yourCompaniesRouter from "./routers/yourCompaniesRouter";
import { ERROR_400_TEMPLATE, LANDING_URL } from "./constants";

const routerDispatch = (app: Application) => {
    app.use(LANDING_URL, yourCompaniesRouter);
    app.use("*", (req: Request, res: Response) => {
        res.status(404).render(ERROR_400_TEMPLATE);
    });
};

export default routerDispatch;
