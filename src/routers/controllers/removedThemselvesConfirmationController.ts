import { Request, Response } from "express";
import { RemoveThemselvesConfirmationHandler } from "../handlers/yourCompanies/removeThemselvesConfirmationHandler";
import * as constants from "../../constants";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Controller for handling the GET request to confirm removal of a user.
 * It retrieves the necessary view data using the handler and renders the appropriate view.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const removedThemselvesConfirmationControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new RemoveThemselvesConfirmationHandler();
    const viewData = await handler.execute(req);
    logger.info(
        createLogMessage(
            req,
            removedThemselvesConfirmationControllerGet.name,
            "Rendering removed themselves confirmation page"
        )
    );
    res.render(constants.REMOVED_THEMSELVES, viewData);
};
