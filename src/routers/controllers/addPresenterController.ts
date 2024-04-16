import { Request, Response } from "express";
import * as constants from "../../constants";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";
import { AddPresenterHandler } from "../handlers/yourCompanies/addPresenterHandler";

export const addPresenterControllerGet = async (req: Request, res: Response): Promise<void> => {
    console.time("addPresenterControllerGet");

    const handler = new AddPresenterHandler();
    const viewData = await handler.execute(req, constants.GET);
    res.render(constants.ADD_PRESENTER_PAGE, viewData);
    console.timeEnd("addPresenterControllerGet");

};

export const addPresenterControllerPost = async (req: Request, res: Response): Promise<void> => {
    console.time("addPresenterControllerPost");

    const handler = new AddPresenterHandler();
    const viewData = await handler.execute(req, constants.POST);

    if (!viewData.errors) {
        const url = getUrlWithCompanyNumber(
            constants.YOUR_COMPANIES_CHECK_PRESENTER_URL,
            viewData.companyNumber as string
        );
        res.redirect(url);
    } else {
        res.render(constants.ADD_PRESENTER_PAGE, viewData);
    }
    console.timeEnd("addPresenterControllerPost");

};
