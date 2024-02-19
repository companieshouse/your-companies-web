import { Request, Response, NextFunction } from "express";
import { RemovePersonHandler } from "../handlers/yourCompanies/removePersonHandler";
import { GET, REMOVE_PERSON_PAGE } from "../../constants";

export const removePersonControllerGet = async (req: Request, res: Response, next: NextFunction) => {
    const handler = new RemovePersonHandler();
    const viewData = await handler.execute(req, res, GET);
    res.render(REMOVE_PERSON_PAGE, {
        ...viewData
    });
};
