import { Request, Response } from "express";
import * as constants from "../../constants";
import { RemoveCompanyConfirmedHandler } from "../handlers/yourCompanies/removeCompanyConfirmedHandler";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles the GET request for the "Remove Company Confirmed" page.
 * Executes the handler to retrieve the necessary view data and renders the appropriate view.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const removeCompanyConfirmedControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new RemoveCompanyConfirmedHandler();
    const viewData = await handler.execute(req);
    logger.info(
        createLogMessage(
            req,
            removeCompanyConfirmedControllerGet.name,
            "Rendering remove company confirmed page"
        )
    );
    res.render(constants.REMOVE_COMPANY_CONFIRMED, viewData);
};
