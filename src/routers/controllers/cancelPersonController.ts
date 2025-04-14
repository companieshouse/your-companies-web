import { Request, Response } from "express";
import { CancelPersonHandler, CancelPersonViewData } from "../handlers/yourCompanies/cancelPersonHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

/**
 * Handles GET requests for the cancel person page.
 * Executes the handler logic, cleans up session data, and renders the page.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const cancelPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CancelPersonHandler();
    const viewData = await handler.execute(req, res, constants.GET);

    cleanUpSessionData(req);
    res.render(constants.CANCEL_PERSON_PAGE, { ...viewData });
};

/**
 * Handles POST requests for the cancel person page.
 * Executes the handler logic, validates errors, and either renders the page or redirects to the confirmation page.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const cancelPersonControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new CancelPersonHandler();
    const viewData = await handler.execute(req, res, constants.POST);

    if (hasErrors(viewData)) {
        res.render(constants.CANCEL_PERSON_PAGE, { ...viewData });
    } else {
        res.redirect(`${viewData.backLinkHref}${constants.CONFIRMATION_CANCEL_PERSON_URL}`);
    }
};

/**
 * Cleans up specific session data by removing unnecessary keys.
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
const hasErrors = (viewData: CancelPersonViewData): boolean => {
    return typeof viewData.errors === "object" && viewData.errors !== null && Object.keys(viewData.errors).length > 0;
};
