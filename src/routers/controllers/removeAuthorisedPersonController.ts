import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";

export const removeAuthorisedPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, constants.GET);
    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, {
        ...viewData
    });
};

export const removeAuthorisedPersonControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, { ...viewData });
    } else {
        res.redirect(constants.YOUR_COMPANIES_REMOVE_ASSOCIATION.replace(`:${constants.COMPANY_NUMBER}`, viewData.companyNumber as string));
    }
};
