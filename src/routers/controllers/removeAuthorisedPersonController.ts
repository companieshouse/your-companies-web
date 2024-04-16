import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import * as constants from "../../constants";

export const removeAuthorisedPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    console.time("removeAuthorisedPersonControllerGet");

    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, constants.GET);
    res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, {
        ...viewData
    });
    console.timeEnd("removeAuthorisedPersonControllerGet");

};

export const removeAuthorisedPersonControllerPost = async (req: Request, res: Response): Promise<void> => {
    console.time("removeAuthorisedPersonControllerPost");

    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, { ...viewData });
    } else {
        res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL.replace(`:${constants.COMPANY_NUMBER}`, viewData.companyNumber as string));
    }
    console.timeEnd("removeAuthorisedPersonControllerPost");

};
