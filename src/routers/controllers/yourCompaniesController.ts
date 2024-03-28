import { Request, Response, RequestHandler } from "express";
import { YourCompaniesHandler } from "../handlers/yourCompanies/yourCompaniesHandler";
import { YOUR_COMPANIES_PAGE, LANDING_URL } from "../../constants";
import { validateSearchString } from "../../lib/validation/generic";
import { sanitizeUrl } from "@braintree/sanitize-url";

export const yourCompaniesControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req);
    res.render(YOUR_COMPANIES_PAGE, {
        ...viewData
    });
};

export const yourCompaniesControllerPost: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    if (!validateSearchString(req.body.search)) {
        return res.redirect(LANDING_URL);
    } else {
        const search = req.body.search.trim();
        const url = `${LANDING_URL}?search=${search}`;
        const sanitizedUrl = sanitizeUrl(url);
        return res.redirect(sanitizedUrl);
    }
};
