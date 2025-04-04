import { Request, Response } from "express";
import { AddCompanyHandler } from "../handlers/yourCompanies/addCompanyHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const addCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, constants.GET);

    deleteExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
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
        res.redirect(getFullUrl(constants.CONFIRM_COMPANY_DETAILS_URL));
    }
};
