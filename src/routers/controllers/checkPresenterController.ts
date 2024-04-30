import { Request, RequestHandler, Response } from "express";
import * as constants from "../../constants";
import { CheckPresenterHandler } from "../handlers/yourCompanies/checkPresenterHandler";

export const checkPresenterControllerGet: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.GET);
    res.render(constants.CHECK_PRESENTER_PAGE, viewData);
};

export const checkPresenterControllerPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        if (viewData.associationAlreadyExist) {
            res.status(400).render(constants.ERROR_400_TEMPLATE);
        } else {
            res.render(constants.CHECK_PRESENTER_PAGE, viewData);
        }
    } else {
        res.redirect(constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            viewData.companyNumber as string
        ));
    }
};
