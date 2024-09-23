import { Request, Response } from "express";
import { RemoveCompanyHandler } from "../handlers/removeCompanyHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const removeCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveCompanyHandler();
    const viewData = await handler.execute(req, res, constants.GET);
    res.render(constants.REMOVE_COMPANY_PAGE, {
        ...viewData
    });
};

export const removeCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveCompanyHandler();
    const viewData = await handler.execute(req, res, constants.POST);
    if (viewData && viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.REMOVE_COMPANY_PAGE, {
            ...viewData
        });
    } else {
        res.redirect(constants.LANDING_URL);
    }
}