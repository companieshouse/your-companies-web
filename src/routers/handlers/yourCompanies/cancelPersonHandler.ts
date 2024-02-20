import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import {
    CANCEL_PERSON,
    CANCEL_PERSON_PAGE,
    COMPANY_NAME,
    COMPANY_NUMBER,
    POST,
    REFERER_URL,
    SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION,
    USER_EMAIL
} from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";

export class CancelPersonHandler extends GenericHandler {
    async execute (req: Request, res: Response, method: string): Promise<any> {
        this.viewData = this.getViewData(req);
        this.viewData.lang = getTranslationsForView(req.t, CANCEL_PERSON_PAGE);
        if (method === POST) {
            const payload = Object.assign({}, req.body);
            if (!payload.cancelPerson) {
                this.viewData.errors = {
                    cancelPerson: {
                        text: SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
                    }
                };
            } else {
                const cancellation: Cancellation = {
                    cancelPerson: payload.cancelPerson,
                    userEmail: req.params[USER_EMAIL],
                    companyNumber: getExtraData(req.session, COMPANY_NUMBER)
                };
                setExtraData(req.session, CANCEL_PERSON, cancellation);
            }
        }
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): any {
        return {
            backLinkHref: getExtraData(req.session, REFERER_URL),
            companyName: getExtraData(req.session, COMPANY_NAME),
            userEmail: req.params[USER_EMAIL],
            buttonHref: req.originalUrl
        };
    }
}
