import { Request, Response } from "express";
import * as constants from "../../constants";
import { SomethingWentWrongHandler } from "../handlers/yourCompanies/somethingWentWrongHandler";

/**
 * Handles GET requests for the "Something Went Wrong" page.
 * Executes the handler to retrieve view data and renders the service unavailable template.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const somethingWentWrongControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await new SomethingWentWrongHandler().execute(req);
    res.status(403).render(constants.SERVICE_UNAVAILABLE_TEMPLATE, viewData);
};
