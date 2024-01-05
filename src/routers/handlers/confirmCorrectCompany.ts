import { Request, Response } from "express";
import { GenericHandler } from "./generic";
import logger from "../../lib/Logger";

export class ConfirmCorrectCompany extends GenericHandler {

    execute (req: Request, response: Response): Promise<Object> {
        logger.info(`GET request to serve the confirm correct company page`);
        // the company information should have been retrieved from an api
        this.viewData = this.getViewData();
        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        return undefined;
    }
};
