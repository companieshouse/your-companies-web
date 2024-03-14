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

export const yourCompaniesControllerPost = async (req: Request, res: Response): Promise<void> => {
    const search = req.body.search.trim();
    // validate search string
    // and save ?
    if (search.length) {
        return res.redirect("/your-companies?search=" + search);
    }
};
