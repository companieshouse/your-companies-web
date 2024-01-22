import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import { LANDING_URL } from "../../../constants";

export class YourCompaniesHandler extends GenericHandler {

    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        this.viewData = this.getViewData(this.userHasCompanies());
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
                buttonHref: "/company-number",
                feedbackSource: LANDING_URL
            };
        }
    }
};
