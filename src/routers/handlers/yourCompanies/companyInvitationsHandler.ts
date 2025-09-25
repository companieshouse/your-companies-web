import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { Invitation, AssociationList, InvitationList, AssociationStatus } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { getInvitations, getUserAssociations } from "../../../services/associationsService";
import { AnyRecord, ViewDataWithBackLink } from "../../../types/utilTypes";
import { InvitationWithCompanyDetail, Invitations } from "../../../types/invitations";
import { buildPaginationElement, setLangForPagination, stringToPositiveInteger } from "../../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../../lib/validation/generic";
import { getCompanyInvitationsAcceptFullUrl, getCompanyInvitationsDeclineFullUrl, getFullUrl } from "../../../lib/utils/urlUtils";
import { Pagination } from "../../../types/pagination";
import { setExtraData } from "../../../lib/utils/sessionUtils";

interface CompanyInvitationsViewData extends ViewDataWithBackLink, Pagination {
    rowsData: ({ text: string } | { html: string })[][];
}

/**
 * Handles the logic for displaying and managing company invitations.
 */
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

    /**
     * Executes the handler logic to fetch and prepare data for the company invitations page.
     * @param req - The HTTP request object.
     * @returns A promise resolving to the view data for the company invitations page.
     */
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

        const invitesWithCompanyDetail = await this.addCompanyInfoToInvites(req, userInvites.items) || [];

        if (userInvites.totalPages > 1) {
            const urlPrefix = getFullUrl(constants.COMPANY_INVITATIONS_URL);
            const pagination = buildPaginationElement(pageNumber, userInvites.totalPages, urlPrefix, "", translations);
            setLangForPagination(pagination, translations);
            this.viewData.pagination = pagination;
            this.viewData.pageNumber = pageNumber;
            this.viewData.numberOfPages = userInvites.totalPages;
        }

        const { rows } = await this.getRowsData(req, invitesWithCompanyDetail, translations);
        this.viewData.rowsData = rows;

        return this.viewData;
    }

    /**
     * Generates the rows data for the invitations table.
     * @param req - Express request object
     * @param invites - The list of invitations with company details.
     * @param translations - The translations for the current language.
     * @returns A promise resolving to the rows data for the invitations table.
     */
    private async getRowsData (req: Request, invites: InvitationWithCompanyDetail[], translations: AnyRecord): Promise<Invitations> {
        const rows: ({ text: string } | { html: string })[][] = [];
        const associationIds: string[] = [];

        if (invites?.length) {
            for (const invite of invites) {
                const acceptPath = getCompanyInvitationsAcceptFullUrl(invite.associationId);
                const declinePath = getCompanyInvitationsDeclineFullUrl(invite.associationId);
                const companyNameQueryParam = `?${constants.COMPANY_NAME}=${invite.companyName.replace(/ /g, "+")}`;

                rows.push([
                    { text: invite.companyName.toUpperCase() },
                    { text: invite.companyNumber },
                    { text: invite.invitedBy },
                    {
                        html: this.getLink(acceptPath + companyNameQueryParam, `${translations.accept_an_invitation_from}${invite.companyName}`, translations.accept as string)
                    },
                    {
                        html: this.getLink(declinePath + companyNameQueryParam, `${translations.decline_an_invitation_from}${invite.companyName}`, translations.decline as string)
                    }
                ]);

                associationIds.push(invite.associationId);
            }
        }

        setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID, associationIds);

        return { rows };
    }

    /**
     * Generates an HTML link for accepting or declining an invitation.
     * @param path - The URL path for the link.
     * @param ariaLabel - The ARIA label for accessibility.
     * @param text - The text to display for the link.
     * @returns The HTML string for the link.
     */
    private getLink (path: string, ariaLabel: string, text: string): string {
        let dataEventId = "";

        if (path.includes("accept")) {
            dataEventId = "accept-invite";
        } else if (path.includes("decline")) {
            dataEventId = "decline-invite";
        }

        return `<a href="${path}" class="govuk-link govuk-link--no-visited-state" aria-label="${ariaLabel}" data-event-id="${dataEventId}">${text}</a>`;
    }

    /**
     * Adds company information to the list of invitations.
     * @param req - The HTTP request object.
     * @param invites - The list of invitations.
     * @returns A promise resolving to the list of invitations with company details.
     */
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
