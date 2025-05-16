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
    deleteExtraData(req.session, constants.CANCEL_URL_EXTRA);
    deleteExtraData(req.session, constants.REMOVE_URL_EXTRA);
    setExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, companyNumber);
};
