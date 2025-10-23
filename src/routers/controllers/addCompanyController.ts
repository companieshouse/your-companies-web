import { Request, Response } from "express";
import { AddCompanyHandler } from "../handlers/yourCompanies/addCompanyHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles the GET request for adding a company.
 * Executes the handler logic, cleans up session data, and renders the add company page.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const addCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, constants.GET);

    deleteExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
    logger.info(createLogMessage(req, addCompanyControllerGet.name, "Renderring add company page"));
    res.render(constants.ADD_COMPANY_PAGE, {
        ...viewData
    });
};

/**
 * Handles the POST request for adding a company.
 * Executes the handler logic, validates the response, and either re-renders the page with errors
 * or redirects to the confirm company details page.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const addCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, constants.POST);

    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        logger.info(createLogMessage(req, addCompanyControllerPost.name, "Renderring add company page"));
        res.render(constants.ADD_COMPANY_PAGE, {
            ...viewData
        });
    } else {
        logger.info(createLogMessage(req, addCompanyControllerPost.name, "Redirecting to confirm company details page"));
        res.redirect(getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL));
    }
};
