import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";
import { ViewData } from "../../../types/util-types";

export class CancelPersonHandler extends GenericHandler {
    async execute (req: Request, res: Response, method: string): Promise<ViewData> {
        this.viewData = this.getViewData(req);
        if (method === constants.POST) {
            const payload = Object.assign({}, req.body);
            if (!payload.cancelPerson) {
                this.viewData.errors = {
                    cancelPerson: {
                        text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
                    }
                };
            } else {
                const cancellation: Cancellation = {
                    cancelPerson: payload.cancelPerson,
                    userEmail: req.params[constants.USER_EMAIL],
                    companyNumber: getExtraData(req.session, constants.COMPANY_NUMBER)
                };
                setExtraData(req.session, constants.CANCEL_PERSON, cancellation);
            }
        }
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): ViewData {
        const lang = getTranslationsForView(req.t, constants.CANCEL_PERSON_PAGE);
        return {
            lang: lang,
            backLinkHref: getExtraData(req.session, constants.REFERER_URL),
            companyName: getExtraData(req.session, constants.COMPANY_NAME),
            userEmail: req.params[constants.USER_EMAIL],
            buttonHref: req.originalUrl
        };
    }
}
