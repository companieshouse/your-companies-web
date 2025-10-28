import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import * as constants from "../../constants";
import { ConfirmationPersonRemovedHandler } from "../../routers/handlers/yourCompanies/confirmationPersonRemovedHandler";

/**
 * Controller for handling GET requests to the confirmation person removed page.
 * Executes the handler to retrieve view data and renders the confirmation page.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const confirmationPersonRemovedControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new ConfirmationPersonRemovedHandler();
    const viewData = await handler.execute(req);

    logger.info(
        createLogMessage(
            req,
            confirmationPersonRemovedControllerGet.name,
            "Rendering confirmation person removed page"
        )
    );

    res.render(constants.CONFIRMATION_PERSON_REMOVED_PAGE, viewData);
};
