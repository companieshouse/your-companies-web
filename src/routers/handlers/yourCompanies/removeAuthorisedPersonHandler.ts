import { Request, Response } from "express";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { GenericHandler } from "../genericHandler";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Removal } from "../../../types/removal";

export class RemoveAuthorisedPersonHandler extends GenericHandler {

    async execute (req: Request, res: Response, method: string): Promise<any> {
        this.viewData = this.getViewData(req);
        this.viewData.lang = getTranslationsForView(req.t, constants.REMOVE_AUTHORISED_PERSON_PAGE);
        if (method === constants.POST) {
            const payload = Object.assign({}, req.body);
            if (!payload.confirmRemoval) {
                this.viewData.errors = { confirmRemoval: { text: constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ } };
            } else {
                const removal: Removal = {
                    removePerson: payload.confirmRemoval,
                    userEmail: req.params[constants.USER_EMAIL],
                    userName: req.query[constants.USER_NAME] ? req.query[constants.USER_NAME] as string : undefined,
                    companyNumber: getExtraData(req.session, constants.COMPANY_NUMBER)
                };
                setExtraData(req.session, constants.REMOVE_PERSON, removal);
            }
        }
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): any {
        return {
            companyNumber: req.params[constants.COMPANY_NUMBER],
            cancelLinkHref: getExtraData(req.session, constants.REFERER_URL),
            backLinkHref: getExtraData(req.session, constants.REFERER_URL),
            companyName: getExtraData(req.session, constants.COMPANY_NAME),
            userEmail: req.params[constants.USER_EMAIL],
            userName: req.query[constants.USER_NAME]
        };
    }

}
