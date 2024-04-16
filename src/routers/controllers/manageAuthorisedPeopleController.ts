import { Request, Response } from "express";
import { ManageAuthorisedPeopleHandler } from "../handlers/yourCompanies/manageAuthorisedPeopleHandler";
import { MANAGE_AUTHORISED_PEOPLE_PAGE } from "../../constants";

export const manageAuthorisedPeopleControllerGet = async (req: Request, res: Response): Promise<void> => {
    console.time("manageAuthorisedPeopleControllerGet");
    const handler = new ManageAuthorisedPeopleHandler();
    const viewData = await handler.execute(req);
    res.render(MANAGE_AUTHORISED_PEOPLE_PAGE, {
        ...viewData
    });
    console.timeEnd("manageAuthorisedPeopleControllerGet");

};
