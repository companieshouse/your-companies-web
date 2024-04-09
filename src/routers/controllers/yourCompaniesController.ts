import { Request, Response } from "express";
import { YourCompaniesHandler } from "../handlers/yourCompanies/yourCompaniesHandler";
import * as constants from "../../constants";
import { validateCompanyNumberSearchString } from "../../lib/validation/generic";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { setExtraData } from "../../lib/utils/sessionUtils";

export const yourCompaniesControllerGet = async (req: Request, res: Response): Promise<void> => {
    const handler = new YourCompaniesHandler();
    const viewData = await handler.execute(req);
    res.render(constants.YOUR_COMPANIES_PAGE, {
        ...viewData
    });
};

export const yourCompaniesControllerPost = async (req: Request, res: Response): Promise<void> => {
    const search = req.body.search.replace(/ /g, "");
    if (!validateCompanyNumberSearchString(search)) {
        if (!req.body.search) {
            setExtraData(req.session, constants.ERROR_MESSAGE_KEY, constants.ENTER_A_COMPANY_NUMBER_OR_PART);
        } else {
            setExtraData(req.session, constants.ERROR_MESSAGE_KEY, constants.COMPANY_NUMBER_MUST_ONLY_INCLUDE);
        }
        res.redirect(constants.LANDING_URL);
    } else {
        const url = `${constants.LANDING_URL}?search=${search}`;
        const sanitizedUrl = sanitizeUrl(url);
        res.redirect(sanitizedUrl);
    }
};
