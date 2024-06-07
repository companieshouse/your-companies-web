// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import router from "./routers/router";
import { SERVICE_UNAVAILABLE_TEMPLATE, LANDING_URL } from "./constants";

const routerDispatch = (app: Application) => {
    app.use(LANDING_URL, router);
    app.use("*", (req: Request, res: Response) => {
        return res.status(404).render(SERVICE_UNAVAILABLE_TEMPLATE);
    });
};

export default routerDispatch;
