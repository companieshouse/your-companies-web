import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import * as constants from "../../constants";
import { ConfirmationPersonAddedHandler } from "../../routers/handlers/yourCompanies/confirmationPersonAddedHandler";

/**
 * Controller for handling GET requests to the confirmation person added page.
 * Executes the handler to retrieve view data and renders the confirmation page.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const confirmationPersonAddedControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new ConfirmationPersonAddedHandler();
    const viewData = await handler.execute(req);

    logger.info(
        createLogMessage(
            req.session,
            confirmationPersonAddedControllerGet.name,
            "Rendering confirmation person added page"
        )
    );

    res.render(constants.CONFIRMATION_PERSON_ADDED_PAGE, viewData);
};
