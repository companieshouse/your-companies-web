import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import * as constants from "../../constants";
import { deleteExtraData } from "../../lib/utils/sessionUtils";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const removeAuthorisedPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, constants.GET);
    deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    deleteExtraData(req.session, constants.USER_EMAILS_ARRAY);

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
        res.redirect(getFullUrl(constants.REMOVE_ASSOCIATION_URL).replace(`:${constants.COMPANY_NUMBER}`, viewData.companyNumber as string));
    }
};
