import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import * as constants from "../../constants";
import { ConfirmationPersonsDigitalAuthorisationRestoredHandler } from "../../routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationRestoredHandler";

/**
 * Controller for handling GET requests to the confirmation person's digital authorisation restored page.
 * Executes the handler to retrieve view data and renders the confirmation page.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const confirmationPersonsDigitalAuthorisationRestoredControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new ConfirmationPersonsDigitalAuthorisationRestoredHandler();
    const viewData = await handler.execute(req);

    logger.info(
        createLogMessage(
            req,
            confirmationPersonsDigitalAuthorisationRestoredControllerGet.name,
            "Rendering confirmation person's digital authorisation restored page"
        )
    );

    res.render(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_RESTORED_PAGE, viewData);
};
