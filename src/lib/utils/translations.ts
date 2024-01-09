import { Request } from "express";

export const getTranslationsForView = (req: Request, viewName: string) => ({
    ...req.t("common", { returnObjects: true }),
    ...req.t(viewName, { returnObjects: true })
});
