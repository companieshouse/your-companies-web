import { Request, Response, NextFunction } from "express";
import { RemoveAuthorisedPersonHandler } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import * as constants from "../../constants";

export const removeAuthorisedPersonControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, res, constants.GET);
    res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, {
        ...viewData
    });
};
