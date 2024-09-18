import { Request, Response } from "express";
import * as constants from "../../constants";
import {
    RemoveCompanyConfirmedHandler
} from "../handlers/yourCompanies/removeCompanyConfirmedHandler";

export const removeCompanyConfirmedControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await new RemoveCompanyConfirmedHandler().execute(req);
    res.render(constants.REMOVE_COMPANY_CONFIRMED, viewData);
};
