import { Request, Response } from "express";
import * as constants from "../../constants";
import { CheckPresenterHandler, CheckPresenterViewData } from "../handlers/yourCompanies/checkPresenterHandler";
import { getFullUrl } from "../../lib/utils/urlUtils";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles GET requests for the Check Presenter page.
 * Executes the handler logic and renders the appropriate view.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const checkPresenterControllerGet = async (req: Request, res: Response): Promise<void> => {
    logger.info(createLogMessage(req, checkPresenterControllerGet.name, "Rendering Check Presenter page"));
    const viewData = await executeHandler(req, constants.GET);
    res.render(constants.CHECK_PRESENTER_PAGE, viewData);
};

/**
 * Handles POST requests for the Check Presenter page.
 * Executes the handler logic, validates the response, and redirects or renders the view accordingly.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const checkPresenterControllerPost = async (req: Request, res: Response): Promise<void> => {
    const viewData = await executeHandler(req, constants.POST);

    if (hasErrors(viewData)) {
        logger.info(createLogMessage(req, checkPresenterControllerPost.name, "Rendering Check Presenter page with errors"));
        res.render(constants.CHECK_PRESENTER_PAGE, viewData);
    } else {
        const redirectUrl = determineRedirectUrl(viewData);
        logger.info(createLogMessage(req, checkPresenterControllerPost.name, `Redirecting to ${redirectUrl}`));
        res.redirect(redirectUrl);
    }
};

/**
 * Executes the CheckPresenterHandler with the given request and method.
 *
 * @param req - The HTTP request object.
 * @param method - The HTTP method (GET or POST).
 * @returns The view data returned by the handler.
 */
const executeHandler = async (req: Request, method: string): Promise<CheckPresenterViewData> => {
    const handler = new CheckPresenterHandler();
    return handler.execute(req, method);
};

/**
 * Checks if the view data contains errors.
 *
 * @param viewData - The data returned by the handler.
 * @returns True if errors exist, otherwise false.
 */
const hasErrors = (viewData: CheckPresenterViewData): boolean => {
    return typeof viewData.errors === "object" && viewData.errors !== null && Object.keys(viewData.errors).length > 0;
};

/**
 * Determines the appropriate redirect URL based on the view data.
 *
 * @param viewData - The data returned by the handler.
 * @returns The full redirect URL.
 */
const determineRedirectUrl = (viewData: CheckPresenterViewData): string => {
    const baseUrl = viewData.associationAlreadyExist
        ? constants.PRESENTER_ALREADY_ADDED_URL
        : constants.CONFIRMATION_PERSON_ADDED_URL;

    return getFullUrl(baseUrl).replace(
        `:${constants.COMPANY_NUMBER}`,
        viewData.companyNumber
    );
};
