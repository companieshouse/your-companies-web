import { COMMON } from "../../constants";
import { AnyRecord } from "../../types/util-types";
import { LocalesService } from "@companieshouse/ch-node-utils";
import { SHARED_NAVBAR_NAMESPACE } from "@companieshouse/ch-node-utils/lib/constants/constants";

export const getTranslationsForView = (lang: string, viewName: string):AnyRecord => {
    const localesServicei18nCh = LocalesService.getInstance().i18nCh;
    return {
        ...localesServicei18nCh.getResourceBundle(lang, SHARED_NAVBAR_NAMESPACE),
        ...localesServicei18nCh.getResourceBundle(lang, COMMON),
        ...localesServicei18nCh.getResourceBundle(lang, viewName)
    };
};
