import { Request, RequestHandler, Response } from "express";
import * as constants from "../../constants";
import { CheckPresenterHandler } from "../handlers/yourCompanies/checkPresenterHandler";

export const checkPresenterControllerGet: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    console.time("checkPresenterControllerGet");

    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.GET);
    res.render(constants.CHECK_PRESENTER_PAGE, viewData);
    console.timeEnd("checkPresenterControllerGet");

};

export const checkPresenterControllerPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    console.time("checkPresenterControllerPost");

    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.CHECK_PRESENTER_PAGE, viewData);
    } else {
        res.redirect(constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            viewData.companyNumber as string
        ));
    }
    console.timeEnd("checkPresenterControllerPost");

};
