import { Request, Response } from "express";
import { YourCompaniesHandler } from "../handlers/yourCompanies/yourCompaniesHandler";
import { YOUR_COMPANIES_PAGE, LANDING_URL } from "../../constants";
import { validateSearchString } from "../../lib/validation/generic";

export const yourCompaniesControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req);
    res.render(YOUR_COMPANIES_PAGE, {
        ...viewData
    });
};

export const yourCompaniesControllerPost = async (req: Request, res: Response): Promise<void> => {
    const search = req.body.search.trim();
    if (validateSearchString(search)) {
        return res.redirect(`${LANDING_URL}?search=${search}`);
    } else return res.redirect(LANDING_URL);
};
