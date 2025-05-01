import { Request, Response } from "express";
import * as constants from "../../constants";
import { getCheckPresenterFullUrl } from "../../lib/utils/urlUtils";
import { AddPresenterHandler } from "../handlers/yourCompanies/addPresenterHandler";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles GET requests for the Add Presenter page.
 * Executes the handler logic and renders the Add Presenter page with the appropriate view data.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const addPresenterControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await executeHandler(req, constants.GET);
    logger.info(createLogMessage(req.session, addPresenterControllerGet.name, "Rendering add presenter page"));
    res.render(constants.ADD_PRESENTER_PAGE, viewData);
};

/**
 * Handles POST requests for the Add Presenter page.
 * Executes the handler logic and either redirects to the Check Presenter page or re-renders the Add Presenter page with errors.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const addPresenterControllerPost = async (req: Request, res: Response): Promise<void> => {
    const viewData = await executeHandler(req, constants.POST);

    if (!viewData.errors) {
        logger.info(createLogMessage(req.session, addPresenterControllerPost.name, "Redirecting to check presenter page"));
        res.redirect(getCheckPresenterFullUrl(viewData.companyNumber));
    } else {
        logger.info(createLogMessage(req.session, addPresenterControllerPost.name, "Rendering add presenter page"));
        res.render(constants.ADD_PRESENTER_PAGE, viewData);
    }
};

/**
 * Executes the AddPresenterHandler logic based on the request and method type.
 *
 * @param req - The HTTP request object.
 * @param method - The HTTP method type (GET or POST).
 * @returns The view data returned by the handler.
 */
const executeHandler = async (req: Request, method: string) => {
    const handler = new AddPresenterHandler();
    return handler.execute(req, method);
};
