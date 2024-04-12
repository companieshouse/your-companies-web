import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { ViewData } from "../../../types/util-types";
import { updateAssociationStatus } from "../../../services/associationsService";
import { AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";

export class CompanyInvitationsAcceptHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        const associationId = req.params[constants.ASSOCIATIONS_ID];
        await updateAssociationStatus(req, associationId, AssociationStatus.CONFIRMED);

        this.viewData = this.getViewData(req);

        return Promise.resolve(this.viewData);
    }

    private getViewData (req: Request): ViewData {
        const translations = getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_ACCEPT_PAGE);
        const companyName = req.query[constants.COMPANY_NAME] as string;
        return {
            lang: translations,
            yourCompaniesUrl: constants.LANDING_URL,
            companyName
        };
    }
}
