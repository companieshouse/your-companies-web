import { Request, Response } from "express";
import {
    SendEmailToBeDigitallyAuthorisedHandler,
    SendEmailToBeDigitallyAuthorisedViewData
} from "../handlers/yourCompanies/sendEmailToBeDigitallyAuthorisedHandler";
import * as constants from "../../constants";
import { getManageAuthorisedPeopleFullUrl } from "../../lib/utils/urlUtils";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles GET requests for the "Send Email to be Digitally Authorised" page.
 * Renders the page with the appropriate view data.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const sendEmailToBeDigitallyAuthorisedControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    logger.info(
        createLogMessage(
            req.session,
            sendEmailToBeDigitallyAuthorisedControllerGet.name,
            "Rendering Send Email to be Digitally Authorised page"
        )
    );
    const viewData = await executeHandler(req, constants.GET);
    res.render(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_PAGE, viewData);
};

/**
 * Handles POST requests for the "Send Email to be Digitally Authorised" page.
 * Processes the form submission and redirects to the confirmation page.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const sendEmailToBeDigitallyAuthorisedControllerPost = async (
    req: Request,
    res: Response
): Promise<void> => {
    const viewData = await executeHandler(req, constants.POST);
    const redirectUrl = getManageAuthorisedPeopleFullUrl(
        constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL,
        viewData.companyNumber
    );

    logger.info(
        createLogMessage(
            req.session,
            sendEmailToBeDigitallyAuthorisedControllerPost.name,
            `Redirecting to ${redirectUrl}`
        )
    );

    res.redirect(redirectUrl);
};

/**
 * Executes the SendEmailToBeDigitallyAuthorisedHandler with the given request and method.
 *
 * @param req - Express request object.
 * @param method - HTTP method (GET or POST).
 * @returns A promise resolving to the view data for rendering.
 */
const executeHandler = async (
    req: Request,
    method: string
): Promise<SendEmailToBeDigitallyAuthorisedViewData> => {
    const handler = new SendEmailToBeDigitallyAuthorisedHandler();
    return handler.execute(req, method);
};
