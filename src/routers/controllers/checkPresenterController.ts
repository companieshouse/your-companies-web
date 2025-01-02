import { Request, RequestHandler, Response } from "express";
import * as constants from "../../constants";
import { CheckPresenterHandler } from "../handlers/yourCompanies/checkPresenterHandler";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const checkPresenterControllerGet: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.GET);
    res.render(constants.CHECK_PRESENTER_PAGE, viewData);
};

export const checkPresenterControllerPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.CHECK_PRESENTER_PAGE, viewData);
    } else {
        if (viewData.associationAlreadyExist) {
            res.redirect(getFullUrl(constants.PRESENTER_ALREADY_ADDED_URL).replace(
                `:${constants.COMPANY_NUMBER}`,
                viewData.companyNumber
            ));
        } else {
            res.redirect(getFullUrl(constants.AUTHORISED_PERSON_ADDED_URL).replace(
                `:${constants.COMPANY_NUMBER}`,
                viewData.companyNumber
            ));
        }
    }
};
