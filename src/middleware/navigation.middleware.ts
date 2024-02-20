import { NextFunction, Request, Response } from "express";
import * as constants from "../constants";

export const isComingFromCheckEmailPage = (req: Request, res: Response, next: NextFunction) => {

    const callerUrl = req.headers.referer;
    const companyNumber: string = req.params[constants.COMPANY_NUMBER];

    if (!callerUrl) {
        return res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            companyNumber
        ));
    }
    const authPersonAddedUrl = constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(
        `:${constants.COMPANY_NUMBER}`,
        companyNumber
    );
    const fromSamePage = callerUrl.includes(authPersonAddedUrl);
    const fromPreviousPage = callerUrl.includes(constants.pages.CHECK_PRESENTER);
    if (fromPreviousPage || fromSamePage) {
        return next();
    }
    return res.status(404).render(constants.ERROR_400_TEMPLATE);
};
