import { Request, Response } from "express";
import { AddCompanyHandler } from "../handlers/yourCompanies/addCompanyHandler";
import * as constants from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const addCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const referrer :string|undefined = req.get("Referrer");

    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    if (redirectPage(referrer, constants.LANDING_URL, constants.ADD_COMPANY_URL, pageIndicator, constants.YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL)) {
        res.redirect(constants.LANDING_URL);
    } else {
        const handler = new AddCompanyHandler();
        const viewData = await handler.execute(req, res, constants.GET);

        res.render(constants.ADD_COMPANY_PAGE, {
            ...viewData
        });
    }
};

export const addCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.ADD_COMPANY_PAGE, {
            ...viewData
        });
    } else {
        res.redirect(constants.YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL);
    }
};
