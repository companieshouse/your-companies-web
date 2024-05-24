import { Request, Response } from "express";
import { RemoveThemselvesConfirmationHandler } from "../handlers/yourCompanies/removeThemselvesConfirmationHandler";
import * as constants from "../../constants";

export const removedThemselvesConfirmationControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await new RemoveThemselvesConfirmationHandler().execute(req);
    res.render(constants.REMOVED_THEMSELVES, viewData);
};
