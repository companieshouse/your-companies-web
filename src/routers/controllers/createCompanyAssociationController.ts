import { Request, Response } from "express";
import * as constants from "../../constants";
import { createAssociation } from "../../services/associationsService";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles the GET request to create a company association.
 * Retrieves the confirmed company for association from the session,
 * creates the association, and redirects to the success URL.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A promise that resolves when the response is sent.
 */
export const createCompanyAssociationControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const confirmedCompany = getExtraData(
        req.session,
        constants.CONFIRMED_COMPANY_FOR_ASSOCIATION
    );

    await createAssociation(req, confirmedCompany.companyNumber);

    logger.info(
        createLogMessage(
            req.session,
            createCompanyAssociationControllerGet.name,
            `Creating association for company number: ${confirmedCompany.companyNumber}`
        )
    );
    setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_ADDED_SUCCESS, true);
    res.redirect(getFullUrl(constants.COMPANY_ADDED_SUCCESS_URL));
};
