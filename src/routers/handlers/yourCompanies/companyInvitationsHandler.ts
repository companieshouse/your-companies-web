import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { Invitation, AssociationList, InvitationList, AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { getInvitations, getUserAssociations } from "../../../services/associationsService";
import { AnyRecord, ViewDataWithBackLink } from "../../../types/utilTypes";
import { InvitationWithCompanyDetail, Invitations } from "../../../types/invitations";
import { buildPaginationElement, setLangForPagination, stringToPositiveInteger } from "../../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../../lib/validation/generic";
import { getCompanyInvitationsAcceptFullUrl, getCompanyInvitationsDeclineFullUrl, getFullUrl } from "../../../lib/utils/urlUtils";
import { Pagination } from "../../../types/pagination";

interface CompanyInvitationsViewData extends ViewDataWithBackLink, Pagination {
    rowsData: ({ text: string } | { html: string })[][];
}

export class CompanyInvitationsHandler extends GenericHandler {
    viewData: CompanyInvitationsViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.COMPANY_INVITATIONS_PAGE,
            backLinkHref: constants.LANDING_URL,
            lang: {},
            pagination: undefined,
            pageNumber: 0,
            numberOfPages: 0,
            rowsData: []
        };
    }

    async execute (req: Request): Promise<CompanyInvitationsViewData> {
        const translations = getTranslationsForView(req.lang, constants.COMPANY_INVITATIONS_PAGE);
        this.viewData.lang = translations;
        const page = req.query.page as string;
        let pageNumber = stringToPositiveInteger(page);
        let userInvites: InvitationList = await getInvitations(req, pageNumber - 1);

        if (!validatePageNumber(pageNumber, userInvites.totalPages)) {
            pageNumber = 1;
            userInvites = await getInvitations(req, pageNumber - 1);
        }

        const invitesWithCompanyDetail: InvitationWithCompanyDetail[] = await this.addCompanyInfoToInvites(req, userInvites.items) || [];

        if (userInvites.totalPages > 1) {
            const urlPrefix = getFullUrl(constants.COMPANY_INVITATIONS_URL);
            const pagination = buildPaginationElement(pageNumber, userInvites.totalPages, urlPrefix, "");
            setLangForPagination(pagination, translations);
            this.viewData.pagination = pagination;
            this.viewData.pageNumber = pageNumber;
            this.viewData.numberOfPages = userInvites.totalPages;
        }

        const { rows } = await this.getRowsData(invitesWithCompanyDetail, translations);
        this.viewData.rowsData = rows;

        return Promise.resolve(this.viewData);
    }

    private async getRowsData (invites: InvitationWithCompanyDetail[], translations: AnyRecord): Promise<Invitations> {
        const rows: ({ text: string } | { html: string })[][] = [];
        if (invites?.length) {
            for (const invite of invites) {
                const acceptPath = getCompanyInvitationsAcceptFullUrl(invite.associationId);
                const declinePath = getCompanyInvitationsDeclineFullUrl(invite.associationId);
                const companyNameQueryParam = `?${constants.COMPANY_NAME}=${invite.companyName.replace(/ /g, "+")}`;

                rows.push([
                    { text: invite.companyName },
                    { text: invite.companyNumber },
                    { text: invite.invitedBy },
                    {
                        html: this.getLink(acceptPath + companyNameQueryParam, `${translations.accept_an_invitation_from}${invite.companyName}`, translations.accept as string)
                    },
                    {
                        html: this.getLink(declinePath + companyNameQueryParam, `${translations.decline_an_invitation_from}${invite.companyName}`, translations.decline as string)
                    }
                ]);
            }
        }
        return { rows };
    }

    private getLink (path: string, ariaLabel: string, text: string): string {
        let dataEventId = "";
        if (path.includes("accept")) {
            dataEventId = "accept-invite";
        } else if (path.includes("decline")) {
            dataEventId = "decline-invite";
        }
        return `<a href="${path}" class="govuk-link govuk-link--no-visited-state" aria-label="${ariaLabel}" data-event-id="${dataEventId}">${text}</a>`;
    }

    private async addCompanyInfoToInvites (req: Request, invites: Invitation[]): Promise<InvitationWithCompanyDetail[] | undefined> {
        const userAssociations: AssociationList = await getUserAssociations(req, [AssociationStatus.AWAITING_APPROVAL], undefined, undefined, constants.INVITATIONS_PER_PAGE);
        if (invites.length) {
            return invites.map(invite => {
                const associationForThisInvite = userAssociations.items.find(assoc => assoc.id === invite.associationId);
                return {
                    ...invite,
                    companyName: associationForThisInvite?.companyName ?? "",
                    companyNumber: associationForThisInvite?.companyNumber ?? ""
                };
            });
        }
    }
}
