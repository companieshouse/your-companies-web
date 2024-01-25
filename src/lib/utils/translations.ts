import { COMMON } from "../../constants";
import i18next from "i18next";

export const getTranslationsForView = (t: typeof i18next.t, viewName: string) => ({
    ...t(COMMON, { returnObjects: true }),
    ...t(viewName, { returnObjects: true })
});
