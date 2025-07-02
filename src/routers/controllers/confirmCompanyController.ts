import { Request, Response } from "express";
import { ConfirmCorrectCompanyHandler } from "../handlers/yourCompanies/confirmCorrectCompanyHandler";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import { getCreateCompanyAssociationFullUrl } from "../../lib/utils/urlUtils";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles the GET request for confirming a company.
 * Retrieves the company profile from the session, sets the confirmation indicator,
 * and renders the confirmation page with the appropriate view data.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const confirmCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const companyProfile = getExtraData(req.session, constants.COMPANY_PROFILE);

    setExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR, true);

    const viewData = await new ConfirmCorrectCompanyHandler().execute(req.lang, companyProfile);
    logger.info(createLogMessage(req.session, confirmCompanyControllerGet.name, "Rendering confirm company page"));
    res.render(constants.CONFIRM_COMPANY_PAGE, viewData);
};

/**
 * Handles the POST request for confirming a company.
 * Stores the confirmed company details in the session and redirects to the next page.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const confirmCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const company = getExtraData(req.session, constants.COMPANY_PROFILE);

    const confirmedCompanyForAssociation: CompanyNameAndNumber = {
        companyNumber: company.companyNumber,
        companyName: company.companyName
    };

    setExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssociation);
    setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE, true);

    const nextPageUrl = getCreateCompanyAssociationFullUrl(company.companyNumber);
    logger.info(createLogMessage(req.session, confirmCompanyControllerPost.name, `Redirecting to ${nextPageUrl}`));
    res.redirect(nextPageUrl);
};
