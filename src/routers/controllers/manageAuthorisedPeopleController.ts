import { Request, Response, Router, NextFunction } from "express";
import { ManageAuthorisedPeopleHandler } from "../handlers/yourCompanies/manageAuthorisedPeople";
import { MANAGE_AUTHORISED_PEOPLE_TEMPLATE } from "../../constants";

export const manageAuthorisedPeopleControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new ManageAuthorisedPeopleHandler();
    const viewData = await handler.execute(req, res);
    res.render(MANAGE_AUTHORISED_PEOPLE_TEMPLATE, {
        ...viewData
    });
};