import { Application, NextFunction, Request, Response } from "express";
import i18next, { InitOptions, Resource } from "i18next";
import * as middleware from "i18next-http-middleware";
import requireDir from "require-directory";

export const enableI18next = (app: Application): void => {
    const resources = requireDir(module, "../../resources", {
        include: /locales/
    }).locales as Resource;

    const options: InitOptions = {
        preload: ["en", "cy"],
        resources,
        fallbackLng: "en",
        supportedLngs: ["en", "cy"],
        detection: {
            order: ["querystring", "cookie"],
            caches: ["cookie"],
            lookupSession: "lang",
            lookupQuerystring: "lang"
        }
    };

    i18next.use(middleware.LanguageDetector).init(options);
    app.use(middleware.handle(i18next));
    app.use((req: Request, res: Response, next: NextFunction) => {
        Object.assign(res.locals, req.t("common", { returnObjects: true }));
        next();
    });
};
