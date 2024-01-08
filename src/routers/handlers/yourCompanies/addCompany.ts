import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";
import { LANDING_URL, POST } from "../../../constants";

export class AddCompanyHandler extends GenericHandler {

    execute (req: Request, res: Response, method: string): Promise<any> {
        logger.info(`${method} request to add company to user account`);
        // ...process request here and return data for the view
        try {
            if (method !== POST) {
                this.viewData = this.getViewData();
            } else {
                const payload = Object.assign({}, req.body);
                console.log(payload.companyNumber);
            }
        } catch (err: any) {
            logger.error(`Error adding a company to user account: ${err}`);
            this.viewData.errors = this.processHandlerException(err);
        }

        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        return {
            backLinkHref: LANDING_URL
        };
    }
};
