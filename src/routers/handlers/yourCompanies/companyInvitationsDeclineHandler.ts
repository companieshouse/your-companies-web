import { Request } from "express";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { GenericHandler } from "../genericHandler";
import { BaseViewData } from "../../../types/util-types";
import { updateAssociationStatus } from "../../../services/associationsService";
import { AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getFullUrl } from "../../../lib/utils/urlUtils";

interface CompanyInvitationsDeclineViewData extends BaseViewData {
    buttonLinkHref: string;
    companyName: string;
    associationStateChanged: string | undefined;
}

export class CompanyInvitationsDeclineHandler extends GenericHandler {
    viewData: CompanyInvitationsDeclineViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.COMPANY_INVITATIONS_DECLINE_PAGE,
            buttonLinkHref: constants.LANDING_URL,
            lang: {},
            associationStateChanged: undefined,
            companyName: ""
        };
    }

    async execute (req: Request): Promise<CompanyInvitationsDeclineViewData> {
        const associationId = req.params[constants.ASSOCIATIONS_ID];
        const associationStateChanged = getExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId) === constants.TRUE;
        const referrer: string | undefined = req.get("Referrer");
        const companyName = req.query[constants.COMPANY_NAME] as string;
        const hrefB = `${getFullUrl(constants.COMPANY_INVITATIONS_DECLINE_URL).replace(":associationId", associationId)}?${constants.COMPANY_NAME}=${(companyName.replace(/ /g, "+")).replace("'", "%27")}`;
        this.viewData.companyName = companyName;

        if (!associationStateChanged) {
            await updateAssociationStatus(req, associationId, AssociationStatus.REMOVED);
            setExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId, constants.TRUE);
            this.viewData.lang = getTranslationsForView(req.lang, constants.COMPANY_INVITATIONS_DECLINE_PAGE);
        } else if (!referrer?.includes(hrefB)) {
            this.viewData.associationStateChanged = constants.ASSOCIATION_STATE_CHANGED_FOR + associationId;
        } else {
            this.viewData.lang = getTranslationsForView(req.lang, constants.COMPANY_INVITATIONS_DECLINE_PAGE);
        }
        return Promise.resolve(this.viewData);
    }
}
