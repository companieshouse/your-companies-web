import { Request, Response } from "express";
import { YourCompaniesHandler } from "../handlers/yourCompanies/yourCompaniesHandler";
import { YOUR_COMPANIES_PAGE } from "../../constants";

export const yourCompaniesControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req);
    res.render(YOUR_COMPANIES_PAGE, {
        ...viewData
    });
};
