import { Request, Response } from "express";
import { CompanyAddSuccessHandler } from "../handlers/yourCompanies/companyAddSuccessHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import logger, { createLogMessage } from "../../lib/Logger";

/**
 * Handles the GET request for the company added success page.
 *
 * This controller performs the following actions:
 * - Deletes extra session data related to company confirmation.
 * - Executes the CompanyAddSuccessHandler to retrieve view data.
 * - Renders the company add success page with the retrieved view data.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const companyAddedControllerGet = async (req: Request, res: Response): Promise<void> => {
    deleteExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
    const viewData = await new CompanyAddSuccessHandler().execute(req);
    logger.info(createLogMessage(req.session, companyAddedControllerGet.name, "Rendering company added success page"));
    res.render(constants.COMPANY_ADD_SUCCESS_PAGE, viewData);
};
