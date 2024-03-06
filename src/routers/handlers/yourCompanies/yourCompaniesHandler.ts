import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { AssociationStatus, Associations } from "../../../types/associations";
import { getUserAssociations } from "../../../services/userCompanyAssociationService";
import { getLoggedInUserEmail, setExtraData } from "../../../lib/utils/sessionUtils";
import { AnyRecord, ViewData } from "../../../types/util-types";

export class YourCompaniesHandler extends GenericHandler {

    async execute (req: Request): Promise<Record<string, unknown>> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        const userEmailAddress = getLoggedInUserEmail(req.session);
        const confirmedUserAssociations: Associations = await getUserAssociations(userEmailAddress, AssociationStatus.CONFIRMED);
        const awaitingApprovalUserAssociations: Associations = await getUserAssociations(userEmailAddress, AssociationStatus.AWAITING_APPROVAL);
        setExtraData(req.session, constants.USER_ASSOCIATIONS, awaitingApprovalUserAssociations);
        const lang = getTranslationsForView(req.t, constants.YOUR_COMPANIES_PAGE);
        this.viewData = this.getViewData(confirmedUserAssociations, awaitingApprovalUserAssociations, lang);
        return Promise.resolve(this.viewData);
    }

    private getViewData (confirmedUserAssociations: Associations, awaitingApprovalUserAssociations: Associations, lang: AnyRecord): ViewData {
        const viewData: AnyRecord = {
            buttonHref: constants.YOUR_COMPANIES_ADD_COMPANY_URL
        };

        if (confirmedUserAssociations?.items?.length > 0) {
            const associationData: { text: string }[][] = [];
            for (let index = 0; index < confirmedUserAssociations.items.length; index++) {
                associationData[index] = [
                    {
                        text: confirmedUserAssociations.items[index].companyName
                    },
                    {
                        text: confirmedUserAssociations.items[index].companyNumber
                    }
                ];
            }

            viewData.associationData = associationData;
            viewData.userHasCompanies = constants.TRUE;
            viewData.viewAndManageUrl = constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL;
            viewData.numberOfInvitations = awaitingApprovalUserAssociations.totalResults;
            viewData.viewInvitationsPageUrl = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL;
        }
        return { ...viewData, lang: lang };
    }
}
