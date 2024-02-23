import { Request, Response, NextFunction } from "express";
import { ManageAuthorisedPeopleHandler } from "../handlers/yourCompanies/manageAuthorisedPeopleHandler";
import { MANAGE_AUTHORISED_PEOPLE_PAGE } from "../../constants";

export const manageAuthorisedPeopleControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ManageAuthorisedPeopleHandler();
    const viewData = await handler.execute(req, res);
    res.render(MANAGE_AUTHORISED_PEOPLE_PAGE, {
        ...viewData
    });
};
