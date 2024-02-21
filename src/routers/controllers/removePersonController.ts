import { Request, Response, NextFunction } from "express";
import { RemoveAuthorisedPersonHandler } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import { GET, REMOVE_AUTHORISED_PERSON_PAGE } from "../../constants";

export const removePersonControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, res, GET);
    res.render(REMOVE_AUTHORISED_PERSON_PAGE, {
        ...viewData
    });
};
