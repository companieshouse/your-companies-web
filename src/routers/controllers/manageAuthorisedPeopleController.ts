import { Request, Response } from "express";
import { ManageAuthorisedPeopleHandler } from "../handlers/yourCompanies/manageAuthorisedPeopleHandler";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import logger, { createLogMessage } from "../../lib/Logger";

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
        deleteSearchStringEmail(req, req.params.companyNumber);
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

export const setSearchStringEmail = (req: Request, email: string, companyNumber:string): void => {
    const emailSearchCollection = getExtraData(req.session, constants.SEARCH_STRING_EMAIL) || {};

    emailSearchCollection[companyNumber] = email;
    setExtraData(req.session, constants.SEARCH_STRING_EMAIL, emailSearchCollection);
};

export const getSearchStringEmail = (req: Request, companyNumber: string): string | undefined => {
    const emailSearchCollection = getExtraData(req.session, constants.SEARCH_STRING_EMAIL);
    return emailSearchCollection?.[companyNumber];
};

export const deleteSearchStringEmail = (req: Request, companyNumber:string): void => {
    const emailSearchCollection = getExtraData(req.session, constants.SEARCH_STRING_EMAIL);
    if (!emailSearchCollection) {
        return;
    }
    delete emailSearchCollection[companyNumber];
    setExtraData(req.session, constants.SEARCH_STRING_EMAIL, emailSearchCollection);
};

/**
 * Handles the Post request for managing authorised people.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const manageAuthorisedPeopleControllerPost = async (req: Request, res: Response): Promise<void> => {

    if (req.body?.action === "trySearch") {
        const searchEmail = req.body?.searchEmail?.trim();
        setSearchStringEmail(req, searchEmail, req.params.companyNumber);
    }
    const handler = new ManageAuthorisedPeopleHandler();
    const viewData = await handler.execute(req);

    logger.info(createLogMessage(req.session, manageAuthorisedPeopleControllerGet.name, "Rendering (Post request) manage authorised people search results page"));
    res.render(constants.MANAGE_AUTHORISED_PEOPLE_PAGE, viewData);
};

export const isCancelSearch = (req: Request): boolean => Object.hasOwn(req.query, constants.CANCEL_SEARCH);
