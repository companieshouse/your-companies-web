import { Request, RequestHandler, Response } from "express";
import * as constants from "../../constants";
import { CheckPresenterHandler } from "../handlers/yourCompanies/checkPresenterHandler";
import { redirectPage } from "../../lib/utils/referrerUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";

export const checkPresenterControllerGet: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    if (redirectPage(referrer, constants.ADD_PRESENTER_URL.replace(":companyNumber", companyNumber),
        constants.CHECK_PRESENTER_URL.replace(":companyNumber", companyNumber), pageIndicator,
        constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(":companyNumber", companyNumber))) {
        res.redirect(constants.LANDING_URL);
    } else {

        const handler = new CheckPresenterHandler();
        const viewData = await handler.execute(req, constants.GET);
        res.render(constants.CHECK_PRESENTER_PAGE, viewData);
    }
};

export const checkPresenterControllerPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const handler = new CheckPresenterHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.CHECK_PRESENTER_PAGE, viewData);
    } else {
        if (viewData.associationAlreadyExist) {
            res.redirect(constants.YOUR_COMPANIES_AUTHORISED_PERSON_NOT_ADDED_URL.replace(
                `:${constants.COMPANY_NUMBER}`,
                viewData.companyNumber as string
            ));
        } else {
            res.redirect(constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(
                `:${constants.COMPANY_NUMBER}`,
                viewData.companyNumber as string
            ));
        }
    }
};
