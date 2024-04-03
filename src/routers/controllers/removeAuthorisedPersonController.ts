import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import * as constants from "../../constants";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const removeAuthorisedPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const referrer :string|undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);

    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

    if (redirectPage(referrer, hrefA, constants.YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL, pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        const handler = new RemoveAuthorisedPersonHandler();
        const viewData = await handler.execute(req, constants.GET);
        res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, {
            ...viewData
        });
    }
};

export const removeAuthorisedPersonControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, { ...viewData });
    } else {
        res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL.replace(`:${constants.COMPANY_NUMBER}`, viewData.companyNumber as string));
    }
};
