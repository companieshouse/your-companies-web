import { Request, Response } from "express";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { GenericHandler } from "../genericHandler";

export class RemovePersonHandler extends GenericHandler {

    async execute (req: Request, res: Response, method: string): Promise<any> {
        this.viewData = this.getViewData(req);
        this.viewData.lang = getTranslationsForView(req.t, constants.REMOVE_PERSON_PAGE);
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): any {
        return {
            backLinkHref: constants.LANDING_URL,
            companyNumber: req.params[constants.COMPANY_NUMBER],
            userEmail: req.params[constants.USER_EMAIL]
            // buttonHref: req.originalUrl
        };
    };

}
