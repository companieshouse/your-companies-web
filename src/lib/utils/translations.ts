import { AnyRecord } from "../../types/utilTypes";
import * as constants from "../../constants";
import {
    SHARED_NUNJUCKS_TRANSLATION_NAMESPACES
} from "@companieshouse/ch-node-utils/lib/constants/constants";
import { i18nCh } from "@companieshouse/ch-node-utils";

export const getTranslationsForView = (lang: string, viewName: string): AnyRecord => {
    return [...SHARED_NUNJUCKS_TRANSLATION_NAMESPACES, constants.COMMON, viewName].reduce(
        (acc, ns) => ({
            ...acc,
            ...i18nCh.getInstance().getResourceBundle(lang, ns)
        }),
        {}
    );
};
