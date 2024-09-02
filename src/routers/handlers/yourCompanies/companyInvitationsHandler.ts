import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { Invitation, AssociationList, InvitationList, AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { getInvitations, getUserAssociations } from "../../../services/associationsService";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { InvitationWithCompanyDetail, Invitations } from "../../../types/invitations";

import { buildPaginationElement, setLangForPagination, stringToPositiveInteger } from "../../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../../lib/validation/generic";

export class CompanyInvitationsHandler extends GenericHandler {
    async execute (req: Request): Promise<ViewData> {
        this.viewData = await this.getViewData(req);
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const translations = getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_PAGE);
        const viewData: ViewData = {
            lang: translations,
            backLinkHref: constants.LANDING_URL
        };

        const page = req.query.page as string;
        let pageNumber = stringToPositiveInteger(page);
        let userInvites: InvitationList = await getInvitations(req, pageNumber - 1);

        if (!validatePageNumber(pageNumber, userInvites.totalPages)) {
            pageNumber = 1;
            userInvites = await getInvitations(req, pageNumber - 1);
        }
        const invitesWithCompanyDetail: InvitationWithCompanyDetail[] = await this.addCompanyInfoToInvites(req, userInvites.items) || [];

        if (userInvites.totalPages > 1) {
            const urlPrefix = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL;
            const pagination = buildPaginationElement(pageNumber, userInvites.totalPages, urlPrefix, "");
            setLangForPagination(pagination, translations);
            viewData.pagination = pagination;
            viewData.pageNumber = pageNumber;
            viewData.numberOfPages = userInvites.totalPages;
        }

        const { rows, acceptIds, declineIds } = await this.getRowsData(invitesWithCompanyDetail, translations);
        viewData.rowsData = rows;
        viewData.acceptIds = acceptIds;
        viewData.declineIds = declineIds;

        return viewData;
    }

    private async getRowsData (invites: InvitationWithCompanyDetail[], translations: AnyRecord): Promise<Invitations> {
        const acceptIds = new Set<string>();
        const declineIds = new Set<string>();
        const rows: ({ text: string } | { html: string })[][] = [];
        if (invites?.length) {
            for (const invite of invites) {
                const acceptPath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_ACCEPT_URL.replace(`:${constants.ASSOCIATIONS_ID}`, invite.associationId);
                const declinePath = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_DECLINE_URL.replace(`:${constants.ASSOCIATIONS_ID}`, invite.associationId);
                const companyNameQueryParam = `?${constants.COMPANY_NAME}=${invite.companyName.replace(/ /g, "+")}`;
                const acceptId = `${""}-${invite.companyNumber}-${invite.invitedBy}`;
                const declineId = `${""}-${invite.companyNumber}-${invite.invitedBy}`;

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
            }
        }
        return { rows, acceptIds: Array.from(acceptIds), declineIds: Array.from(declineIds) };
    }

    private getLink (path: string, ariaLabel: string, text: string, id: string): string {
        return `<a href="${path}" id="${id}" class="govuk-link govuk-link--no-visited-state" aria-label="${ariaLabel}">${text}</a>`;
    }

    private async addCompanyInfoToInvites (req: Request, invites: Invitation[]): Promise<InvitationWithCompanyDetail[] | undefined> {
        const userAssociations: AssociationList = await getUserAssociations(req, [AssociationStatus.AWAITING_APPROVAL], undefined, undefined, constants.INVITATIONS_PER_PAGE);
        if (invites.length) {
            return invites.map(invite => {
                const associationForThisInvite = userAssociations.items.find(assoc => assoc.id === invite.associationId);
                return {
                    ...invite,
                    companyName: associationForThisInvite?.companyName || "",
                    companyNumber: associationForThisInvite?.companyNumber || ""
                };
            });
        }
    }
}
