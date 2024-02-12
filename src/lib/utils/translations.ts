import { COMMON } from "../../constants";
import i18next from "i18next";
import { AnyRecord } from "../../types/util-types";

export const getTranslationsForView = (t: typeof i18next.t, viewName: string):AnyRecord => ({
    ...t(COMMON, { returnObjects: true }),
    ...t(viewName, { returnObjects: true })
});
