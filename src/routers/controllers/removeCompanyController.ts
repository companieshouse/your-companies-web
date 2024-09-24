import { Request, Response } from "express";
import { RemoveCompanyHandler } from "../handlers/removeCompanyHandler";
import * as constants from "../../constants";
import logger from "../../lib/Logger";

export const removeCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {

    const handler = new RemoveCompanyHandler();
    const viewData = await handler.execute(req, res, constants.GET);
    if (!viewData) {
        logger.error("Failed to load view data for GET request");
        return res.status(500).render("error-page", { message: "Failed to load company removal page" });
    }
    res.render(constants.REMOVE_COMPANY_PAGE, { ...viewData });

};
export const removeCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveCompanyHandler();
    const viewData = await handler.execute(req, res, constants.POST);

    if (viewData) {
        if (viewData.errors && Object.keys(viewData.errors).length > 0) {
            return res.render(constants.REMOVE_COMPANY_PAGE, { ...viewData });
        }
        if (viewData.submissionSuccessful && !viewData.removalCancelled) {
            return res.redirect(constants.REMOVE_COMPANY_CONFIRMED_FULL_URL);
        }
        if (viewData.removalCancelled) {
            return res.redirect(constants.LANDING_URL);
        }
    }
};
