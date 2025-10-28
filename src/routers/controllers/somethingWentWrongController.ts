import { Request, Response } from "express";
import * as constants from "../../constants";
import { SomethingWentWrongHandler } from "../handlers/yourCompanies/somethingWentWrongHandler";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles GET requests for the "Something Went Wrong" page.
 * Executes the handler to retrieve view data and renders the service unavailable template.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const somethingWentWrongControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new SomethingWentWrongHandler();
    const viewData = await handler.execute(req);
    const statusCode = viewData.csrfErrors ? 403 : 500;

    logger.info(
        createLogMessage(
            req,
            somethingWentWrongControllerGet.name,
            "Rendering something went wrong page"
        )
    );
    res.status(statusCode).render(constants.SERVICE_UNAVAILABLE_TEMPLATE, viewData);
};
