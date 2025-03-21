import { Request, Response } from "express";
import * as constants from "../../constants";
import { CheckPresenterHandler } from "../handlers/yourCompanies/checkPresenterHandler";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const checkPresenterControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.GET);
    res.render(constants.CHECK_PRESENTER_PAGE, viewData);
};

export const checkPresenterControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.CHECK_PRESENTER_PAGE, viewData);
    } else {
        const url = viewData.associationAlreadyExist
            ? constants.PRESENTER_ALREADY_ADDED_URL
            : constants.AUTHORISED_PERSON_ADDED_URL;
        res.redirect(getFullUrl(url).replace(
            `:${constants.COMPANY_NUMBER}`,
            viewData.companyNumber
        ));
    }
};
