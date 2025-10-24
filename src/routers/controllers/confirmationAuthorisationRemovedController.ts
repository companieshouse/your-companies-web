import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";
import * as constants from "../../constants";
import { ConfirmationAuthorisationRemovedHandler } from "../../routers/handlers/yourCompanies/confirmationAuthorisationRemovedHandler";

export const confirmationAuthorisationRemovedControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const handler = new ConfirmationAuthorisationRemovedHandler();
    const viewData = await handler.execute(req);
    logger.info(
        createLogMessage(
            req,
            confirmationAuthorisationRemovedControllerGet.name,
            "Rendering confirmation authorisation removed page"
        )
    );
    res.render(constants.CONFIRMATION_AUTHORISATION_REMOVED_PAGE, viewData);
};
