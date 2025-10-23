import { Request, Response } from "express";
import { YourCompaniesHandler } from "../handlers/yourCompanies/yourCompaniesHandler";
import * as constants from "../../constants";
import { sanitizeUrl } from "@braintree/sanitize-url";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles GET requests for the Your Companies page.
 * Executes the handler logic and renders the page with the provided view data.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const yourCompaniesControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req);
    logger.info(createLogMessage(req, yourCompaniesControllerGet.name, "Rendering your companies page"));
    res.render(constants.YOUR_COMPANIES_PAGE, { ...viewData });
};

/**
 * Handles POST requests for the Your Companies page.
 * Processes the search input, sanitizes the resulting URL, and redirects to the landing page.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const yourCompaniesControllerPost = async (req: Request, res: Response): Promise<void> => {
    const searchQuery = req.body.search.replace(/ /g, "");
    const redirectUrl = `${constants.LANDING_URL}?search=${searchQuery}`;
    const sanitizedUrl = sanitizeUrl(redirectUrl);
    logger.info(createLogMessage(req, yourCompaniesControllerPost.name, `Redirecting to sanitized URL: ${sanitizedUrl}`));
    res.redirect(sanitizedUrl);
};
