import { Request, Response } from "express";
import * as constants from "../../constants";
import { SomethingWentWrongHandler } from "../handlers/yourCompanies/somethingWentWrongHandler";

export const somethingWentWrongControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new SomethingWentWrongHandler();
    const viewData = await handler.execute(req);
    res.status(403).render(constants.SERVICE_UNAVAILABLE_TEMPLATE, viewData);
};
