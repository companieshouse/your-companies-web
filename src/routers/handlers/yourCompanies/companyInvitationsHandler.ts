import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { Association, Associations, AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { getUserAssociations } from "../../../services/associationsService";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { getNewestInvite } from "../../../lib/helpers/invitationHelper";

export class CompanyInvitationsHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        this.viewData = await this.getViewData(req);
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const userAssociations: Associations = await getUserAssociations(req, [AssociationStatus.AWAITING_APPROVAL], undefined, undefined, constants.INVITATIONS_PER_PAGE);
        const translations = getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_PAGE);
        const rowsData = await this.getRowsData(userAssociations.items, translations);

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
                    const newestInvite = getNewestInvite(association.invitations);
                    const acceptPath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_ACCEPT_URL.replace(`:${constants.ASSOCIATIONS_ID}`, association.id);
                    const declinePath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_DECLINE_URL.replace(`:${constants.ASSOCIATIONS_ID}`, association.id);
                    const companyNameQueryParam = `?${constants.COMPANY_NAME}=${association.companyName.replace(/ /g, "+")}`;
                    rows.push([
                        { text: association.companyName },
                        { text: association.companyNumber },
                        { text: newestInvite.invitedBy },
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
        return rows;
    }

    private getLink (path: string, ariaLabel: string, text: string): string {
        return `<a href="${path}" class="govuk-link govuk-link--no-visited-state" aria-label="${ariaLabel}">${text}</a>`;
    }
}
