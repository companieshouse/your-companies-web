import { Request, Response } from "express";
import {
    ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler
} from "../handlers/yourCompanies/confirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import logger, { createLogMessage } from "../../lib/Logger";
import { getTryRestoringYourDigitalAuthorisationFullUrl } from "../../lib/utils/urlUtils";

/**
 * Handles GET requests for confirming company details when restoring digital authorisation.
 * Sets a session indicator and renders the confirmation page with company details.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet = async (
    req: Request,
    res: Response
): Promise<void> => {
    const companyNumber = req.params[constants.COMPANY_NUMBER];

    setExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR, true);

    const handler = new ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler();
    const viewData = await handler.execute(req, companyNumber);

    logger.info(
        createLogMessage(
            req.session,
            confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet.name,
            "Rendering confirm company details for restoring your digital authorisation page"
        )
    );

    res.render(constants.CONFIRM_COMPANY_PAGE, viewData);
};

/**
 * Handles POST requests for confirming company details when restoring digital authorisation.
 * Stores the confirmed company in the session and redirects to the next step.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost = async (
    req: Request,
    res: Response
): Promise<void> => {
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const company = getExtraData(req.session, `${constants.COMPANY_PROFILE}_${companyNumber}`);

    const confirmedCompanyForAssociation: CompanyNameAndNumber = {
        companyNumber: company.companyNumber,
        companyName: company.companyName
    };

    setExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssociation);
    setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_RESTORE_YOUR_DIGITAL_AUTHORISATION_SUCCESS, true);

    const nextPageUrl = getTryRestoringYourDigitalAuthorisationFullUrl(company.companyNumber);

    logger.info(
        createLogMessage(
            req.session,
            confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost.name,
            `Redirecting to ${nextPageUrl}`
        )
    );

    res.redirect(nextPageUrl);
};
