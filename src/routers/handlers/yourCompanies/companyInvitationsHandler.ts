import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getLoggedInUserEmail } from "../../../lib/utils/sessionUtils";
import { Association, AssociationStatus, Associations } from "../../../types/associations";
import { getUserAssociations } from "../../../services/userCompanyAssociationService";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { getUserRecord } from "../../../services/userService";

export class CompanyInvitationsHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        this.viewData = await this.getViewData(req);
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const userEmailAddress = getLoggedInUserEmail(req.session);
        const userAssociations: Associations = await getUserAssociations(userEmailAddress);
        const awaitingApproval = userAssociations.items?.filter(item => item.status === AssociationStatus.AWAITING_APPROVAL);
        const translations = getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_PAGE);
        const rowsData = await this.getRowsData(awaitingApproval, translations);

        return {
            backLinkHref: constants.LANDING_URL,
            rowsData: rowsData,
            lang: translations
        };
    }

    private async getRowsData (userAssociations: Association[], translations: AnyRecord): Promise<({ text: string; } | { html: string; })[][]> {
        const rows: ({ text: string } | { html: string })[][] = [];
        if (userAssociations?.length) {
            for (const association of userAssociations) {
                if (association.invitations?.length) {
                    for (const invite of association.invitations) {
                        const user = await getUserRecord(invite.invitedBy);
                        const acceptPath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_ACCEPT_URL.replace(`:${constants.ASSOCIATIONS_ID}`, association.id);
                        const declinePath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_DECLINE_URL.replace(`:${constants.ASSOCIATIONS_ID}`, association.id);
                        const companyNameQueryParam = `?${constants.COMPANY_NAME}=${association.companyName}`;
                        rows.push([
                            { text: association.companyName },
                            { text: association.companyNumber },
                            { text: user?.email as string },
                            {
                                html: this.getLink(acceptPath + companyNameQueryParam, `${translations.accept_an_invitation_from} ${association.companyName}`, translations.accept as string)
                            },
                            {
                                html: this.getLink(declinePath + companyNameQueryParam, `${translations.decline_an_invitation_from} ${association.companyName}`, translations.decline as string)
                            }
                        ]);
                    }
                }
            }
        }
        return rows;
    }

    private getLink (path: string, ariaLabel: string, text: string): string {
        return `<a href="${path}" class="govuk-link govuk-link--no-visited-state" aria-label="${ariaLabel}">${text}</a>`;
    }
}
