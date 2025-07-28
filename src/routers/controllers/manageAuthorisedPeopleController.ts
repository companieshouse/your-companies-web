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
 * Handles the Post request for managing authorised people
 * which handles the form data for searching users by email.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
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

export const isCancelSearch = (req: Request): boolean => Object.hasOwn(req.query, constants.CANCEL_SEARCH);
