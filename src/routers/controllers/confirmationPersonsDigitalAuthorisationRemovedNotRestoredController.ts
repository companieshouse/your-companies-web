import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import * as constants from "../../constants";
import { ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler } from "../../routers/handlers/yourCompanies/confirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler";

/**
 * Controller for handling GET requests to the confirmation person's digital authorisation removed not restored page.
 * Executes the handler to retrieve view data and renders the confirmation page.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const confirmationPersonsDigitalAuthorisationRemovedNotRestoredControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new ConfirmationPersonsDigitalAuthorisationRemovedNotRestoredHandler();
    const viewData = await handler.execute(req);

    logger.info(
        createLogMessage(
            req.session,
            confirmationPersonsDigitalAuthorisationRemovedNotRestoredControllerGet.name,
            "Rendering confirmation person's digital authorisation removed not restored page"
        )
    );

    res.render(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_PAGE, viewData);
};
