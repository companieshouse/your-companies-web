import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import * as constants from "../../constants";
import { ConfirmationAuthorisationEmailResentHandler } from "../../routers/handlers/yourCompanies/confirmationAuthorisationEmailResentHandler";

/**
 * Controller for handling GET requests to the confirmation authorisation email resent page.
 * Executes the handler to retrieve view data and renders the confirmation page.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const confirmationAuthorisationEmailResentControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new ConfirmationAuthorisationEmailResentHandler();
    const viewData = await handler.execute(req);

    logger.info(
        createLogMessage(
            req.session,
            confirmationAuthorisationEmailResentControllerGet.name,
            "Rendering confirmation authorisation email resent page"
        )
    );

    res.render(constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_PAGE, viewData);
};
