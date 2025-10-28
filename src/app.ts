import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import nunjucks from "nunjucks";
import path from "path";
import logger from "./lib/Logger";
import routerDispatch from "./routerDispatch";
import cookieParser from "cookie-parser";
import { sessionMiddleware, ensureSessionCookiePresentMiddleware } from "./middleware/session.middleware";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import * as constants from "./constants";
import { getLoggedInUserEmail, getLoggedInUserId } from "./lib/utils/sessionUtils";
import { addLangToUrl } from "./lib/utils/urlUtils";
import * as errorHandler from "./routers/controllers/errorController";
import { getTranslationsForView } from "./lib/utils/translations";
import { LocalesMiddleware, LocalesService } from "@companieshouse/ch-node-utils";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";
import { prepareCSPConfig } from "./middleware/content.security.policy.middleware.config";
import nocache from "nocache";
import { csrfProtectionMiddleware } from "./middleware/csrf.protection.middleware";
import { requestIdGenerator } from "./middleware/request.id.generator.middleware";
import { requestLogger } from "./middleware/request.logger.middleware";

const app = express();

app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "/../node_modules/govuk-frontend/dist"),
    path.join(__dirname, "node_modules/govuk-frontend/dist"),
    path.join(__dirname, "/../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "/../node_modules/@companieshouse/web-security-node/components"),
    path.join(__dirname, "node_modules/@companieshouse/web-security-node/components")
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
njk.addGlobal("displayYourCompanies", "yes");
njk.addGlobal("accountUrl", process.env.ACCOUNT_URL);
njk.addGlobal("ENGLISH", "en");
njk.addGlobal("WELSH", "cy");

// If app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client
app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set x-request-id header for all requests
app.use(requestIdGenerator);

app.use(cookieParser());
const nonce: string = uuidv4();

app.use(nocache());
app.use(helmet(prepareCSPConfig(nonce)));

app.use(`${constants.LANDING_URL}*`, sessionMiddleware);

app.use(requestLogger);

app.use(`${constants.LANDING_URL}*`, ensureSessionCookiePresentMiddleware);

app.use(`${constants.LANDING_URL}*`, csrfProtectionMiddleware);
app.use(`${constants.LANDING_URL}*`, authenticationMiddleware);

LocalesService.getInstance("locales", true);
app.use(LocalesMiddleware());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.locale = req.lang;
    res.locals.userEmailAddress = getLoggedInUserEmail(req.session);
    res.locals.feedbackSource = req.originalUrl;
    res.locals.addLangToUrl = (lang: string) => addLangToUrl(req.originalUrl, lang);
    res.locals.nonce = nonce;
    res.locals.userId = getLoggedInUserId(req.session);
    next();
});

Object.entries(constants.MATOMO_GOALS).forEach(([key, value]) => {
    njk.addGlobal(key, value);
});

// Channel all requests through router dispatch
routerDispatch(app);

// http-error error handler
app.use(errorHandler.httpErrorHandler);
app.use(errorHandler.csrfErrorHandler);

// Unhandled errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    const translations = getTranslationsForView(req.lang ?? "en", constants.SERVICE_UNAVAILABLE);
    res.render(constants.SERVICE_UNAVAILABLE_TEMPLATE, { lang: translations });
});

// Unhandled exceptions
process.on("uncaughtException", (err: Error) => {
    logger.error(`${err.name} - uncaughtException: ${err.message} - ${err.stack}`);
    process.exit(1);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
    logger.error(`${err.name} - unhandledRejection: ${err.message} - ${err.stack}`);
    process.exit(1);
});

export default app;
