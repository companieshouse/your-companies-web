import { NextFunction, Request, Response } from "express";
import * as constants from "../constants";

export const authPersonAdded = (req: Request, res: Response, next: NextFunction) => {

    const callerUrl = req.headers.referer;

    if (!callerUrl) {
        const companyNumber: string = req.params[constants.COMPANY_NUMBER];
        return res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            companyNumber
        ));
    }
    const conditions = ["/your-companies/manage-authorised-people/", "/confirmation-person-added"];

    const fromSamePage = conditions.some(str => callerUrl.includes(str));
    const fromPreviousPage = callerUrl.includes(constants.pages.CHECK_PRESENTER);
    if (fromPreviousPage || fromSamePage) {
        return next();
    }
    return res.status(404).render(constants.ERROR_400_TEMPLATE);
};
