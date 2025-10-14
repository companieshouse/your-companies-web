import { Request, Response } from "express";
import {
    ConfirmationYourDigitalAuthorisationRestoredHandler
} from "../handlers/yourCompanies/confirmationYourDigitalAuthorisationRestoredHandler";
import * as constants from "../../constants";
import logger, { createLogMessage } from "../../lib/Logger";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

/**
 * Controller to handle GET requests for the "Restore Your Digital Authorisation Success" page.
 * Executes the handler to retrieve view data, logs the action, and renders the success page.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<void>
 */
export const confirmationYourDigitalAuthorisationRestoredControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new ConfirmationYourDigitalAuthorisationRestoredHandler();
    const viewData = await handler.execute(req);
    deleteExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS);

    logger.info(
        createLogMessage(
            req.session,
            confirmationYourDigitalAuthorisationRestoredControllerGet.name,
            "Rendering restore your digital authorisation success page"
        )
    );

    res.render(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_PAGE, viewData);
};
