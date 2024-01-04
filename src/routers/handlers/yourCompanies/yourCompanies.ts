import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";

export class YourCompaniesHandler extends GenericHandler {

    constructor () {
        super();
        this.viewData = this.getViewData(this.userHasCompanies());
    }

    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request for to serve home page`);
        // ...process request here and return data for the view
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
                buttonHref: "/company-number"
            };
        }
    }
};
