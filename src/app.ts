import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import nunjucks from "nunjucks";
import path from "path";
import logger from "./lib/Logger";
import routerDispatch from "./routerDispatch";
import { enableI18next } from "./middleware/i18next.language";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./middleware/session.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import * as constants from "./constants";
import { getLoggedInUserEmail } from "./lib/utils/sessionUtils";
import { addLangToUrl } from "./lib/utils/urlUtils";
import { httpErrorHandler } from "./routers/controllers/httpErrorController";
import { getTranslationsForView } from "./lib/utils/translations";

const app = express();

app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "/../node_modules/govuk-frontend/dist"),
    path.join(__dirname, "node_modules/govuk-frontend/dist"),
    path.join(__dirname, "/../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "node_modules/@companieshouse/ch-node-utils/templates")
]);

const nunjucksLoaderOpts = {
    watch: process.env.NUNJUCKS_LOADER_WATCH !== "false",
    noCache: process.env.NUNJUCKS_LOADER_NO_CACHE !== "true"
};

const njk = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(app.get("views"),
        nunjucksLoaderOpts)
);

njk.express(app);
app.set("view engine", "njk");

// Serve static files
app.use(express.static(path.join(__dirname, "/../assets/public")));

njk.addGlobal("cdnUrlCss", process.env.CDN_URL_CSS);
njk.addGlobal("cdnUrlJs", process.env.CDN_URL_JS);
njk.addGlobal("cdnHost", process.env.ANY_PROTOCOL_CDN_HOST);
njk.addGlobal("chsUrl", process.env.CHS_URL);
njk.addGlobal("chsMonitorGuiUrl", process.env.CHS_MONITOR_GUI_URL);
njk.addGlobal("notProvided", constants.NOT_PROVIDED);
njk.addGlobal("confirmed", constants.CONFIRMED);
njk.addGlobal("piwikUrl", process.env.PIWIK_URL);
njk.addGlobal("piwikSiteId", process.env.PIWIK_SITE_ID);
njk.addGlobal("piwikChsDomain", process.env.PIWIK_CHS_DOMAIN);
njk.addGlobal("serviceName", constants.SERVICE_NAME);

// If app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client
app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(`${constants.LANDING_URL}*`, sessionMiddleware);
app.use(`${constants.LANDING_URL}*`, authenticationMiddleware);

// Add i18next middleware and retrieve user email address to use in view
enableI18next(app);
app.use((req: Request, res: Response, next: NextFunction) => {
    njk.addGlobal("locale", req.language);
    njk.addGlobal("userEmailAddress", getLoggedInUserEmail(req.session));
    njk.addGlobal("feedbackSource", req.originalUrl);
    njk.addGlobal("ENGLISH", "en");
    njk.addGlobal("WELSH", "cy");
    njk.addGlobal("addLangToUrl", (lang: string) => addLangToUrl(req.originalUrl, lang));
    njk.addGlobal("matomoButtonClick", constants.MATOMO_BUTTON_CLICK);
    njk.addGlobal("matomoLinkClick", constants.MATOMO_LINK_CLICK);
    njk.addGlobal("matomoBackLink", constants.MATOMO_BACK_LINK);
    next();
});

// Channel all requests through router dispatch
routerDispatch(app);

// http-error error handler
app.use(httpErrorHandler);

// Unhandled errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    const translations = getTranslationsForView(req.t, constants.SERVICE_UNAVAILABLE);
    res.render(constants.SERVICE_UNAVAILABLE_TEMPLATE, { lang: translations });
});

// Unhandled exceptions
process.on("uncaughtException", (err: any) => {
    logger.error(`${err.name} - uncaughtException: ${err.message} - ${err.stack}`);
    process.exit(1);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
    logger.error(`${err.name} - unhandledRejection: ${err.message} - ${err.stack}`);
    process.exit(1);
});

export default app;
