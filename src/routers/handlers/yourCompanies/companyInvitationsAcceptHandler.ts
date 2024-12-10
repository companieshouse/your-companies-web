import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { ViewData } from "../../../types/util-types";
import { updateAssociationStatus } from "../../../services/associationsService";
import { AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getFullUrl } from "../../../lib/utils/urlUtils";

export class CompanyInvitationsAcceptHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        const associationId = req.params[constants.ASSOCIATIONS_ID];
        const associationStateChanged = getExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId) === constants.TRUE;
        const referrer: string | undefined = req.get("Referrer");
        const companyName = req.query[constants.COMPANY_NAME] as string;
        const hrefB = `${getFullUrl(constants.COMPANY_INVITATIONS_ACCEPT_URL).replace(":associationId", associationId)}?${constants.COMPANY_NAME}=${(companyName.replace(/ /g, "+")).replace("'", "%27")}`;

        if (!associationStateChanged) {
            await updateAssociationStatus(req, associationId, AssociationStatus.CONFIRMED);
            setExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId, constants.TRUE);
            this.viewData = this.getViewData(req);
        } else if (associationStateChanged && referrer?.includes(hrefB)) {
            this.viewData = this.getViewData(req);
        } else {
            this.viewData = { associationStateChanged: constants.ASSOCIATION_STATE_CHANGED_FOR + associationId, lang: {} };
        }

        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): ViewData {
        const translations = getTranslationsForView(req.lang, constants.COMPANY_INVITATIONS_ACCEPT_PAGE);
        const companyName = req.query[constants.COMPANY_NAME] as string;
        return {
            templateName: constants.COMPANY_INVITATIONS_ACCEPT_PAGE,
            lang: translations,
            yourCompaniesUrl: constants.LANDING_URL,
            companyName
        };
    }
}
