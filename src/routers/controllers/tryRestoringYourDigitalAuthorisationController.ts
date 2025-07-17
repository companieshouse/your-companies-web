import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { createAssociation } from "../../services/associationsService";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import logger, { createLogMessage } from "../../lib/Logger";
import { getFullUrl } from "../../lib/utils/urlUtils";

/**
 * Handles GET requests to attempt restoring a user's digital authorisation for a company association.
 *
 * - Retrieves the confirmed company from the session.
 * - Logs the attempt to restore digital authorisation.
 * - Calls the association service to restore the authorisation.
 * - Redirects to the success page upon completion.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<void>
 */
export const tryRestoringYourDigitalAuthorisationControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const confirmedCompanyForAssociation: CompanyNameAndNumber = getExtraData(
        req.session,
        constants.CONFIRMED_COMPANY_FOR_ASSOCIATION
    );

    logger.info(
        createLogMessage(
            req.session,
            tryRestoringYourDigitalAuthorisationControllerGet.name,
            `Calling API to restore digital authorisation for association with company ID: ${confirmedCompanyForAssociation.companyNumber}`
        )
    );

    await createAssociation(req, confirmedCompanyForAssociation.companyNumber);
    setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS, true);

    res.redirect(getFullUrl(constants.RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS_URL));
};
