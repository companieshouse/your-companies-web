import { Request, Response } from "express";
import * as constants from "../../constants";
import { getCheckPresenterFullUrl } from "../../lib/utils/urlUtils";
import { AddPresenterHandler } from "../handlers/yourCompanies/addPresenterHandler";

export const addPresenterControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new AddPresenterHandler();
    const viewData = await handler.execute(req, constants.GET);
    res.render(constants.ADD_PRESENTER_PAGE, viewData);
};

export const addPresenterControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new AddPresenterHandler();
    const viewData = await handler.execute(req, constants.POST);

    if (!viewData.errors) {
        const url = getCheckPresenterFullUrl(viewData.companyNumber);
        res.redirect(url);
    } else {
        res.render(constants.ADD_PRESENTER_PAGE, viewData);
    }

};
