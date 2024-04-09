import { Request, Response } from "express";
import { AddCompanyHandler } from "../handlers/yourCompanies/addCompanyHandler";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";

export const addCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {

    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, constants.GET);

    if (getExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR)) {
        deleteExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
    }

    res.render(constants.ADD_COMPANY_PAGE, {
        ...viewData
    });
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
