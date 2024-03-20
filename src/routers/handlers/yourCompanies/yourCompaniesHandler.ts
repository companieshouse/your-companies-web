import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { AssociationStatus, Associations } from "../../../types/associations";
import { getUserAssociations } from "../../../services/userCompanyAssociationService";
import { getLoggedInUserEmail, setExtraData } from "../../../lib/utils/sessionUtils";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { sortAndSearch, paginatedSection, paginationElement } from "../../../lib/helper/buildPaginationHelper";

export class YourCompaniesHandler extends GenericHandler {

    async execute (req: Request): Promise<Record<string, unknown>> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        const userEmailAddress = getLoggedInUserEmail(req.session);
        const confirmedUserAssociations: Associations = await getUserAssociations(userEmailAddress, AssociationStatus.CONFIRMED);

        const search = req.query.search as string;
        const page = req.query.page as string;

        const pageNumber = isNaN(Number(page)) ? 1 : Number(page);

        const sortedAndFilteredItems = sortAndSearch(confirmedUserAssociations?.items, search);
        const paginatedList: Associations = {
            items: [],
            totalResults: confirmedUserAssociations?.totalResults
        };

        // this is the segment of 15 or so paginated associations displayed on the page
        paginatedList.items = paginatedSection(sortedAndFilteredItems, pageNumber) || [];

        const awaitingApprovalUserAssociations: Associations = await getUserAssociations(userEmailAddress, AssociationStatus.AWAITING_APPROVAL);
        setExtraData(req.session, constants.USER_ASSOCIATIONS, awaitingApprovalUserAssociations);
        const lang = getTranslationsForView(req.t, constants.YOUR_COMPANIES_PAGE);

        this.viewData = this.getViewData(paginatedList, awaitingApprovalUserAssociations, lang);
        this.viewData.search = search;

        // displaySearchForm toggles diplay for search input form
        if ((sortedAndFilteredItems && sortedAndFilteredItems?.length > constants.ITEMS_PER_PAGE) || !!search?.length) {
            this.viewData.displaySearchForm = true;
        }

        // toggles display for number of matches found
        this.viewData.showNumOfMatches = !!search?.length;
        this.viewData.numOfMatches = sortedAndFilteredItems?.length;

        if (search?.length) {
            this.viewData.userHasCompanies = constants.TRUE;
        }

        if (sortedAndFilteredItems?.length) {
            this.viewData.pagination = paginationElement(pageNumber, sortedAndFilteredItems?.length, search);
        }

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
