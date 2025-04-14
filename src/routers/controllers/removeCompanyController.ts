import { Request, Response } from "express";
import { RemoveCompanyHandler } from "../handlers/yourCompanies/removeCompanyHandler";
import * as constants from "../../constants";
import { BaseViewData } from "../../types/utilTypes";

/**
 * Handles GET requests for removing a company.
 * Renders the remove company page with the appropriate view data.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const removeCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveCompanyHandler();
    const viewData = await handler.execute(req, res, constants.GET);
    res.render(constants.REMOVE_COMPANY_PAGE, viewData as BaseViewData);
};

/**
 * Handles POST requests for removing a company.
 * If there are validation errors, re-renders the remove company page with error data.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export const removeCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveCompanyHandler();
    const viewData = await handler.execute(req, res, constants.POST);

    if (viewData?.errors && Object.keys(viewData.errors).length > 0) {
        return res.render(constants.REMOVE_COMPANY_PAGE, viewData);
    }
};
