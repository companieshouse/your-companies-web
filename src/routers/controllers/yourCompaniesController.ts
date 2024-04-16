import { Request, Response } from "express";
import { YourCompaniesHandler } from "../handlers/yourCompanies/yourCompaniesHandler";
import * as constants from "../../constants";
import { validateCompanyNumberSearchString } from "../../lib/validation/generic";
import { sanitizeUrl } from "@braintree/sanitize-url";

export const yourCompaniesControllerGet = async (req: Request, res: Response): Promise<void> => {
    console.time("yourCompaniesControllerGet");

    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req);
    res.render(constants.YOUR_COMPANIES_PAGE, {
        ...viewData
    });
    console.timeEnd("yourCompaniesControllerGet");

};

export const yourCompaniesControllerPost = async (req: Request, res: Response): Promise<void> => {
    console.time("yourCompaniesControllerPost");

    const search = req.body.search.replace(/ /g, "");
    if (!validateCompanyNumberSearchString(search)) {
        res.redirect(constants.LANDING_URL);
    } else {
        const url = `${constants.LANDING_URL}?search=${search}`;
        const sanitizedUrl = sanitizeUrl(url);
        res.redirect(sanitizedUrl);
    }
    console.timeEnd("yourCompaniesControllerPost");

};
