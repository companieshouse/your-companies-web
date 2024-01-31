import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import logger from "../../../lib/Logger";

export class ManageAuthorisedPeopleHandler extends GenericHandler {

    execute (req: Request, res: Response): Promise<Object> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        this.viewData = this.getViewData();
        return Promise.resolve(this.viewData);
    }

    private getViewData (): any {
        return {};
    }
}
