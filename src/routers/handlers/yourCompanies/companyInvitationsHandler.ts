import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { AssociationList, InvitationList, AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { getInvitations, getUserAssociations } from "../../../services/associationsService";
import { AnyRecord, ViewData } from "../../../types/util-types";
// import { getNewestInvite } from "../../../lib/helpers/invitationHelper";
import { Invitations } from "../../../types/invitations";

export interface InvitationWithCompanyDetail {
    invitedBy: string;
    invitedAt: string;
    associationId: string;
    isActive: boolean;
    companyName: string;
    companyNumber: string;
}

export class CompanyInvitationsHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        this.viewData = await this.getViewData(req);
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const userInvites: InvitationList = await getInvitations(req);

        const userAssociations: AssociationList = await getUserAssociations(req, [AssociationStatus.AWAITING_APPROVAL], undefined, undefined, constants.INVITATIONS_PER_PAGE);

        const translations = getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_PAGE);

        let invitesWithCompanyDetail: InvitationWithCompanyDetail[] = [];
        if (userInvites.items?.length) {
            invitesWithCompanyDetail = userInvites.items.map(invite => {
                const associationForThisInvite = userAssociations.items.find(assoc => assoc.id === invite.associationId);
                return {
                    ...invite,
                    companyName: associationForThisInvite?.companyName || "",
                    companyNumber: associationForThisInvite?.companyNumber || ""
                };
            });
        }

        const { rows, acceptIds, declineIds } = await this.getRowsDataUpdate(invitesWithCompanyDetail, translations);

        return {
            backLinkHref: constants.LANDING_URL,
            rowsData: rows,
            lang: translations,
            matomoAcceptAuthorisedUserInvitationLink: constants.MATOMO_ACCEPT_INVITATION_LINK,
            matomoDeclineAuthorisedUserInvitationLink: constants.MATOMO_DECLINE_INVITATION_LINK,
            acceptIds: acceptIds,
            declineIds: declineIds
        };
    }

    // private async getRowsData (userAssociations: Association[], translations: AnyRecord): Promise<Invitations> {
    //     const acceptIds = new Set<string>();
    //     const declineIds = new Set<string>();
    //     const rows: ({ text: string } | { html: string })[][] = [];
    //     if (userAssociations?.length) {
    //         for (const association of userAssociations) {
    //             if (association.invitations?.length) {
    //                 const newestInvite = getNewestInvite(association.invitations);
    //                 const acceptPath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_ACCEPT_URL.replace(`:${constants.ASSOCIATIONS_ID}`, association.id);
    //                 const declinePath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_DECLINE_URL.replace(`:${constants.ASSOCIATIONS_ID}`, association.id);
    //                 const companyNameQueryParam = `?${constants.COMPANY_NAME}=${association.companyName.replace(/ /g, "+")}`;
    //                 const acceptId = `${constants.MATOMO_ACCEPT_INVITATION_LINK_ID}-${association.companyNumber}-${newestInvite.invitedBy}`;
    //                 const declineId = `${constants.MATOMO_DECLINE_INVITATION_LINK_ID}-${association.companyNumber}-${newestInvite.invitedBy}`;

    //                 acceptIds.add(acceptId);
    //                 declineIds.add(declineId);

    //                 rows.push([
    //                     { text: association.companyName },
    //                     { text: association.companyNumber },
    //                     { text: newestInvite.invitedBy },
    //                     {
    //                         html: this.getLink(acceptPath + companyNameQueryParam, `${translations.accept_an_invitation_from} ${association.companyName}`, translations.accept as string, acceptId)
    //                     },
    //                     {
    //                         html: this.getLink(declinePath + companyNameQueryParam, `${translations.decline_an_invitation_from} ${association.companyName}`, translations.decline as string, declineId)
    //                     }
    //                 ]);
    //             }
    //         }
    //     }
    //     return { rows, acceptIds: Array.from(acceptIds), declineIds: Array.from(declineIds) };
    // }

    private async getRowsDataUpdate (invites:InvitationWithCompanyDetail[], translations: AnyRecord): Promise<Invitations> {
        const acceptIds = new Set<string>();
        const declineIds = new Set<string>();
        const rows: ({ text: string } | { html: string })[][] = [];
        if (invites?.length) {
            for (const invite of invites) {
                //     if (association.invitations?.length) {
                //  const newestInvite = getNewestInvite(association.invitations);
                const acceptPath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_ACCEPT_URL.replace(`:${constants.ASSOCIATIONS_ID}`, invite.associationId);
                const declinePath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_DECLINE_URL.replace(`:${constants.ASSOCIATIONS_ID}`, invite.associationId);
                // comapny name number and invited by
                // get /associations/id
                // const associationData: Association = await getAssocation(req, invite.associationId);
                const companyNameQueryParam = `?${constants.COMPANY_NAME}=${invite.companyName.replace(/ /g, "+")}`;
                const acceptId = `${constants.MATOMO_ACCEPT_INVITATION_LINK_ID}-${invite.companyNumber}-${invite.invitedBy}`;
                const declineId = `${constants.MATOMO_DECLINE_INVITATION_LINK_ID}-${invite.companyNumber}-${invite.invitedBy}`;

                acceptIds.add(acceptId);
                declineIds.add(declineId);

                rows.push([
                    { text: invite.companyName },
                    { text: invite.companyNumber },
                    { text: invite.invitedBy },
                    {
                        html: this.getLink(acceptPath + companyNameQueryParam, `${translations.accept_an_invitation_from} ${invite.companyName}`, translations.accept as string, acceptId)
                    },
                    {
                        html: this.getLink(declinePath + companyNameQueryParam, `${translations.decline_an_invitation_from} ${invite.companyName}`, translations.decline as string, declineId)
                    }
                ]);
                //  }
            }
        }
        return { rows, acceptIds: Array.from(acceptIds), declineIds: Array.from(declineIds) };
    }

    private getLink (path: string, ariaLabel: string, text: string, id: string): string {
        return `<a href="${path}" id="${id}" class="govuk-link govuk-link--no-visited-state" aria-label="${ariaLabel}">${text}</a>`;
    }

}
