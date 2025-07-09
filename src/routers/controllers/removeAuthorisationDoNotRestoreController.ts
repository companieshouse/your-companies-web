import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import * as constants from "../../constants";
import {
    RemoveAuthorisationDoNotRestoreHandler,
    RemoveAuthorisationDoNotRestoreViewData
} from "../../routers/handlers/yourCompanies/removeAuthorisationDoNotRestoreHandler";

export const removeAuthorisationDoNotRestoreControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new RemoveAuthorisationDoNotRestoreHandler();
    const viewData = await handler.execute(req, res, constants.GET) as RemoveAuthorisationDoNotRestoreViewData;
    logger.info(
        createLogMessage(
            req.session,
            RemoveAuthorisationDoNotRestoreHandler.name,
            "Rendering remove authorisation and do not restore page"
        )
    );
    res.render(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE, viewData);
};

/**
 * Handles POST requests for removing a user's authorisation from a company.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const removeAuthorisationDoNotRestoreControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisationDoNotRestoreHandler();
    await handler.execute(req, res, constants.POST);
};
