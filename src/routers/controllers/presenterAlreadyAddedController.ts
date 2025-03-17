import { PresenterAlreadyAddedHandler } from "../handlers/yourCompanies/presenterAlreadyAddedHandler";
import * as constants from "../../constants";
import { Request, Response } from "express";

export const presenterAlreadyAddedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new PresenterAlreadyAddedHandler();
    const viewData = await handler.execute(req);
    res.render(constants.PRESENTER_ALREADY_ADDED_PAGE, viewData);
};
