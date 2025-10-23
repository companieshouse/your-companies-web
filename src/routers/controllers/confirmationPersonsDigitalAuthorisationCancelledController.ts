import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import * as constants from "../../constants";
import { ConfirmationPersonsDigitalAuthorisationCancelledHandler } from "../../routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationCancelledHandler";

/**
 * Controller for handling GET requests to the confirmation person's digital authorisation cancelled page.
 * Executes the handler to retrieve view data and renders the confirmation page.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const confirmationPersonsDigitalAuthorisationCancelledControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new ConfirmationPersonsDigitalAuthorisationCancelledHandler();
    const viewData = await handler.execute(req);

    logger.info(
        createLogMessage(
            req,
            confirmationPersonsDigitalAuthorisationCancelledControllerGet.name,
            "Rendering confirmation person's digital authorisation cancelled page"
        )
    );

    res.render(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_PAGE, viewData);
};
