import { Request } from "express";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { GenericHandler } from "../genericHandler";
import { ViewData } from "../../../types/util-types";
import { updateAssociationStatus } from "../../../services/associationsService";
import { AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";

export class CompanyInvitationsDeclineHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        const associationId = req.params[constants.ASSOCIATIONS_ID];
        const associationStateChanged = getExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId) === constants.TRUE;
        if (!associationStateChanged) {
            await updateAssociationStatus(req, associationId, AssociationStatus.REMOVED);
            setExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId, constants.TRUE);
            this.viewData = this.getViewData(req);
        } else {
            this.viewData = { associationStateChanged: constants.ASSOCIATION_STATE_CHANGED_FOR + associationId, lang: {} };
        }
        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): ViewData {
        const lang = getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_DECLINE_PAGE);
        return {
            companyName: req.query[constants.COMPANY_NAME] as string,
            buttonLinkHref: constants.LANDING_URL,
            lang: lang
        };
    }
}
