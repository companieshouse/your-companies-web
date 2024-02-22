import { Application } from "express";
import i18next, { InitOptions, Resource } from "i18next";
import * as middleware from "i18next-http-middleware";
import requireDir from "require-directory";
import path from "path";

const locales = path.join(__dirname, "/../locales");
export const enableI18next = (app: Application): void => {
    const resources = requireDir(module, locales) as Resource;

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
};
