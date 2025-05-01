import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler, RemoveAuthorisedPersonViewData } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles GET requests for removing an authorised person.
 * Executes the handler logic, cleans up session data, and renders the appropriate view.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const removeAuthorisedPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData: RemoveAuthorisedPersonViewData = await handler.execute(req, constants.GET);

    cleanUpSessionData(req);
    logger.info(createLogMessage(req.session, removeAuthorisedPersonControllerGet.name, "Rendering remove authorised person page"));
    res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, { ...viewData });
};

/**
 * Handles POST requests for removing an authorised person.
 * Executes the handler logic, validates the response, and either renders the view with errors
 * or redirects to the appropriate URL upon success.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const removeAuthorisedPersonControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData: RemoveAuthorisedPersonViewData = await handler.execute(req, constants.POST);

    if (hasErrors(viewData)) {
        logger.info(createLogMessage(req.session, removeAuthorisedPersonControllerPost.name, "Rendering remove authorised person page with errors"));
        res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, { ...viewData });
    } else {
        logger.info(createLogMessage(req.session, removeAuthorisedPersonControllerPost.name, "Redirecting to remove association URL"));
        res.redirect(buildRedirectUrl(viewData.companyNumber));
    }
};

/**
 * Cleans up session data by removing specific keys.
 *
 * @param session - The session object from the request.
 */
const cleanUpSessionData = (req: Request): void => {
    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    deleteExtraData(req.session, constants.USER_EMAILS_ARRAY);
};

/**
 * Checks if the view data contains errors.
 *
 * @param viewData - The data returned by the handler.
 * @returns True if errors exist, otherwise false.
 */
const hasErrors = (viewData: RemoveAuthorisedPersonViewData): boolean => {
    return !!viewData.errors && typeof viewData.errors === "object" && Object.keys(viewData.errors).length > 0;
};

/**
 * Builds the redirect URL by replacing the company number placeholder.
 *
 * @param companyNumber - The company number to include in the URL.
 * @returns The fully constructed redirect URL.
 */
const buildRedirectUrl = (companyNumber: string): string => {
    return getFullUrl(constants.REMOVE_ASSOCIATION_URL).replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
};
