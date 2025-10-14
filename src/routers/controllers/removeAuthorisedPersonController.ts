import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler, RemoveAuthorisedPersonViewData } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import * as constants from "../../constants";
import { deleteExtraData, deleteSearchStringEmail } from "../../lib/utils/sessionUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";

/**
 * Handles GET requests for removing an authorised person.
 * Executes the handler logic, cleans up session data, and renders the appropriate view.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const removeAuthorisedPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData: RemoveAuthorisedPersonViewData = await handler.execute(req);

    cleanUpSessionData(req);
    logger.info(createLogMessage(req.session, removeAuthorisedPersonControllerGet.name, "Rendering remove authorised person page"));
    res.render(handler.getTemplateViewName(), viewData);
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
    await handler.handlePostRequest(req, res);

};

/**
 * Cleans up session data by removing specific keys.
 *
 * @param session - The session object from the request.
 */
const cleanUpSessionData = (req: Request): void => {
    deleteSearchStringEmail(req.session as Session, req.params[constants.COMPANY_NUMBER]);
    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    deleteExtraData(req.session, constants.USER_EMAILS_ARRAY);
    deleteExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE);
};
