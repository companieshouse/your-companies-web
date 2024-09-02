import { Application } from "express";
import i18next, { InitOptions, Resource } from "i18next";
import * as middleware from "i18next-http-middleware";
import path from "path";
import fs, { existsSync } from "fs";
import { AnyRecord } from "../types/util-types";

const locales = path.join(__dirname, "/../locales");
const _chNodeUtilsLocalesLocal = path.join(__dirname, "/../../node_modules/@companieshouse/ch-node-utils/locales");
const _chNodeUtilsLocalesEnvironment = path.join(__dirname, "/../node_modules/@companieshouse/ch-node-utils/locales");
const chNodeUtilsLocales = existsSync(_chNodeUtilsLocalesLocal) ? _chNodeUtilsLocalesLocal : _chNodeUtilsLocalesEnvironment;

function loadJsonFiles (dir: string): AnyRecord {
    return fs.readdirSync(chNodeUtilsLocales)
        .filter(file => file.endsWith(".json"))
        .reduce((acc: AnyRecord, file) => {
            const fileName = path.parse(file).name;
            acc[fileName] = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
            return acc;
        }, {});
}

export const enableI18next = (app: Application): void => {

    /*
     * Construct the resources object by merging translations from different sources:
     * 1. Local translations specific to this application
     * 2. Navbar translations from the @companieshouse/ch-node-utils package
     *
     * We merge these into the 'common' namespace to ensure that navbar translations
     * are available on all templates, alongside our local common translations.
     *
     * This approach allows us to:
     * - Reuse shared components (like the navbar)
     * - Maintain the ability to override or extend translations as needed
     */
    const resources = ["en", "cy"].reduce((acc: AnyRecord, lang) => {
        const chNodeUtilsTranslations: AnyRecord = loadJsonFiles(path.join(chNodeUtilsLocales, lang));
        const localTranslations: AnyRecord = loadJsonFiles(path.join(locales, lang, "translation"));

        acc[lang] = {
            translation: {
                ...localTranslations,
                common: {
                    ...chNodeUtilsTranslations.navbar as AnyRecord,
                    ...localTranslations.common as AnyRecord
                }
            }
        };

        return acc;
    }, {}) as Resource;

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
