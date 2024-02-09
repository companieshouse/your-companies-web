import { Request, Response } from "express";
import { GenericHandler } from "../generic";
import {
    CANCEL_PERSON,
    CANCEL_PERSON_LANG,
    CANCEL_PERSON_URL,
    COMPANY_NAME,
    POST,
    REFERER_URL,
    SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION,
    USER_EMAIL,
    YES
} from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { setExtraData } from "../../../lib/utils/sessionUtils";

export class CancelPersonHandler extends GenericHandler {
    async execute (req: Request, res: Response, method: string): Promise<any> {
        this.viewData = this.getViewData(req);
        this.viewData.lang = getTranslationsForView(req.t, CANCEL_PERSON_LANG);
        if (method === POST) {
            const payload = Object.assign({}, req.body);
            if (!payload.cancelPerson) {
                this.viewData.errors = {
                    cancelPerson: {
                        text: SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
                    }
                };
            } else {
                setExtraData(req.session, CANCEL_PERSON, payload.cancelPerson);
            }
        }
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): any {
        return {
            backLinkHref: req.session?.getExtraData(REFERER_URL),
            companyName: req.session?.getExtraData(COMPANY_NAME),
            userEmail: req.params[USER_EMAIL],
            buttonHref: req.originalUrl
        };
    }
}
