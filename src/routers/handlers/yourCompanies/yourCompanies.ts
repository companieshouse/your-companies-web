import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import {
    LANDING_URL,
    YOUR_COMPANIES_ADD_COMPANY_URL,
    YOUR_COMPANIES_LANG
} from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";

export class YourCompaniesHandler extends GenericHandler {

    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        this.viewData = this.getViewData(this.userHasCompanies());
        this.viewData.lang = getTranslationsForView(req.t, YOUR_COMPANIES_LANG);
        return Promise.resolve(this.viewData);
    }

    private userHasCompanies (): boolean {
        // TODO: The logic will be added as part of IDVA6-337
        return false;
    }

    private getViewData (userHasCompanies: boolean): any {
        if (userHasCompanies) {
            // TODO: The logic will be added as part of IDVA6-337
        } else {
            return {
                buttonHref: YOUR_COMPANIES_ADD_COMPANY_URL,
                feedbackSource: LANDING_URL
            };
        }
    }
};
