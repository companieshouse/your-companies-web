import { PresenterAlreadyAddedHandler } from "../handlers/yourCompanies/presenterAlreadyAddedHandler";
import * as constants from "../../constants";
import { Request, Response } from "express";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles GET requests for the "Presenter Already Added" page.
 * It initializes the handler, executes the logic, and renders the appropriate view.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const presenterAlreadyAddedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new PresenterAlreadyAddedHandler();
    const viewData = await handler.execute(req);
    logger.info(createLogMessage(req.session, presenterAlreadyAddedControllerGet.name, "Rendering presenter already added page"));
    res.render(constants.PRESENTER_ALREADY_ADDED_PAGE, viewData);
};
