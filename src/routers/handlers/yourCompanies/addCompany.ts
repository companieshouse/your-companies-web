import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import { LANDING_URL, YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL } from "../../../constants";

export class AddCompanyHandler extends GenericHandler {

    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve Your Companies add company page`);
        // ...process request here and return data for the view
        this.viewData = this.getViewData();
        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        return {
            backLinkHref: LANDING_URL,
            buttonHref: YOUR_COMPANIES_CONFIRM_COMPANY_DETAILS_URL
        };
    }
};
