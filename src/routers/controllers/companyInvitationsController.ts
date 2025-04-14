import { Request, Response } from "express";
import * as constants from "../../constants";
import { CompanyInvitationsHandler } from "../handlers/yourCompanies/companyInvitationsHandler";

/**
 * Handles GET requests for the company invitations page.
 * Executes the business logic through the CompanyInvitationsHandler
 * and renders the company invitations page with the retrieved data.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves when the response is sent.
 */
export const companyInvitationsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CompanyInvitationsHandler();
    const viewData = await handler.execute(req);
    res.render(constants.COMPANY_INVITATIONS_PAGE, { ...viewData });
};
