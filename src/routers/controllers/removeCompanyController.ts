import { Request, Response } from "express";
import { RemoveCompanyHandler } from "../handlers/yourCompanies/removeCompanyHandler";
import * as constants from "../../constants";
import { ViewData } from "../../types/util-types";

export const removeCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveCompanyHandler();
    const viewData = await handler.execute(req, res, constants.GET);
    res.render(constants.REMOVE_COMPANY_PAGE, viewData as ViewData);
};

export const removeCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveCompanyHandler();
    const viewData = await handler.execute(req, res, constants.POST);
    if (viewData && viewData.errors && Object.keys(viewData.errors).length > 0) {
        return res.render(constants.REMOVE_COMPANY_PAGE, viewData);
    }
};