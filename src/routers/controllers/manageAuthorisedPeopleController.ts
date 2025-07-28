import { Request, Response } from "express";
import { ManageAuthorisedPeopleHandler } from "../handlers/yourCompanies/manageAuthorisedPeopleHandler";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData, setExtraData, deleteSearchStringEmail, setSearchStringEmail } from "../../lib/utils/sessionUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";

/**
 * Handles the GET request for managing authorised people.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const manageAuthorisedPeopleControllerGet = async (req: Request, res: Response): Promise<void> => {
    if (isCancelSearch(req)) {
        logger.info(createLogMessage(req.session, manageAuthorisedPeopleControllerGet.name, "User cancelled search"));
        deleteSearchStringEmail(req.session as Session, req.params.companyNumber);
    }
    const handler = new ManageAuthorisedPeopleHandler();
    const viewData = await handler.execute(req);

    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    setSessionData(req, companyNumber);

    logger.info(createLogMessage(req.session, manageAuthorisedPeopleControllerGet.name, "Rendering manage authorised people page"));
    res.render(constants.MANAGE_AUTHORISED_PEOPLE_PAGE, {
        ...viewData
    });
};

/**
 * Sets and deletes session data related to managing authorised people.
 *
 * @param req - The HTTP request object.
 * @param companyNumber - The company number to be stored in the session.
 */
const setSessionData = (req: Request, companyNumber: string): void => {
    deleteExtraData(req.session, constants.REMOVE_URL_EXTRA);
    setExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, companyNumber);
};

/**
 * Handles POST requests for managing authorised people.
 *
 * - If the form action is "trySearch", it processes the search email and updates the session.
 * - Instantiates `ManageAuthorisedPeopleHandler` to execute business logic and retrieve view data.
 * - Renders the manage authorised people page with the obtained view data.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A promise that resolves when the response has been rendered.
 */
export const manageAuthorisedPeopleControllerPost = async (req: Request, res: Response): Promise<void> => {

    if (req.body?.action === "trySearch") {
        const searchEmail = req.body?.searchEmail?.trim();
        setSearchStringEmail(req?.session as Session, searchEmail, req.params.companyNumber);
    }
    const handler = new ManageAuthorisedPeopleHandler();
    const viewData = await handler.execute(req);

    logger.info(createLogMessage(req.session, manageAuthorisedPeopleControllerPost.name, "Rendering (Post request) manage authorised people search results page"));
    res.render(constants.MANAGE_AUTHORISED_PEOPLE_PAGE, viewData);
};

/**
 * Determines if the cancel search action has been triggered based on the request query parameters.
 *
 * @param req - The Express request object containing query parameters.
 * @returns `true` if the `CANCEL_SEARCH` constant is present in the query parameters, otherwise `false`.
 */
export const isCancelSearch = (req: Request): boolean => Object.hasOwn(req.query, constants.CANCEL_SEARCH);
