import { Application, Request, Response } from "express";
import router from "./routers/router";
import * as constants from "./constants";
import { getTranslationsForView } from "./lib/utils/translations";

/**
 * Configures the application to handle routing and dispatch requests to the appropriate handlers.
 *
 * @param app - The Express application instance.
 */
const routerDispatch = (app: Application): void => {
    app.use(constants.LANDING_URL, router);
    app.use("*", (req: Request, res: Response) => {
        const translations = getTranslationsForView(req.lang, constants.SERVICE_UNAVAILABLE);
        res.status(404).render(constants.SERVICE_UNAVAILABLE_TEMPLATE, { lang: translations });
    });
};

export default routerDispatch;
