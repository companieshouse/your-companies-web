import { Request, Response } from "express";
import { AddCompanyHandler } from "../handlers/yourCompanies/addCompanyHandler";
import {
    ADD_COMPANY_PAGE,
    GET,
    LANDING_URL,
    POST,
    YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL
} from "../../constants";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const addCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const referrer :string|undefined = req.get("Referrer");
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, GET);
    if (redirectPage(referrer, "http://chs.local/your-companies/", "http://chs.local/your-companies/confirm-company-details/")) {
        console.log("Hello world");
    }
    res.render(ADD_COMPANY_PAGE, {
        ...viewData
    });
};

export const addCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new AddCompanyHandler();
    const viewData = await handler.execute(req, res, POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(ADD_COMPANY_PAGE, {
            ...viewData
        });
    } else {
        res.redirect(YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL);
    }
};
