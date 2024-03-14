import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { AssociationStatus, Associations } from "../../../types/associations";
import { getUserAssociations } from "../../../services/userCompanyAssociationService";
import { getLoggedInUserEmail, setExtraData } from "../../../lib/utils/sessionUtils";
import { AnyRecord, ViewData } from "../../../types/util-types";
// import { fakeAssociations } from "../../../lib/createRandomAssociation";
import { buildPaginationElement, PaginationData } from "../../../services/buildPaginationService";

export class YourCompaniesHandler extends GenericHandler {

    async execute (req: Request): Promise<Record<string, unknown>> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        console.log("1");
        const userEmailAddress = getLoggedInUserEmail(req.session);
        const confirmedUserAssociations: Associations = await getUserAssociations(userEmailAddress, AssociationStatus.CONFIRMED);
        let paginationElement: PaginationData | undefined;
        const paginatedList: Associations = {
            items: [],
            totalResults: 0
        };
        console.log("1.5");

        //   console.table(fakeAssociations);
        //  confirmedUserAssociations.items.push(...fakeAssociations);
        if (confirmedUserAssociations?.items?.length) {
            confirmedUserAssociations.items.sort((a, b) => {
                if (a.companyName < b.companyName) {
                    return -1;
                }
                if (a.companyName > b.companyName) {
                    return 1;
                }
                // names must be equal
                return 0;
            });
            console.log("2");

            console.log("len of CONFIRMED ASSOCIATIONS - ", confirmedUserAssociations.items.length);

            const search = req.query.search as string;
            if (search && search.length) {
                confirmedUserAssociations.items = confirmedUserAssociations.items.filter(item => {
                    return item.companyName.includes(search.toUpperCase()) ||
                item.companyNumber.includes(search);
                });
            }
        }
        console.log("3");

        if (confirmedUserAssociations?.items?.length) {
            // Get current page number
            const page = req.query.page;
            const pageNumber = isNaN(Number(page)) ? 1 : Number(page);
            const objectsPerPage = 15;
            const startIndex = (pageNumber - 1) * objectsPerPage;
            const endIndex = startIndex + objectsPerPage;
            paginatedList.items = confirmedUserAssociations.items.slice(startIndex, endIndex);

            // Create pagination element to navigate pages
            const numOfPages = Math.ceil(confirmedUserAssociations.items.length / objectsPerPage);
            paginationElement = buildPaginationElement(
                pageNumber, // current page
                numOfPages, // number of pages
                "/your-companies"
            );
        }

        const awaitingApprovalUserAssociations: Associations = await getUserAssociations(userEmailAddress, AssociationStatus.AWAITING_APPROVAL);
        setExtraData(req.session, constants.USER_ASSOCIATIONS, awaitingApprovalUserAssociations);
        console.log("4");

        const lang = getTranslationsForView(req.t, constants.YOUR_COMPANIES_PAGE);
        this.viewData = this.getViewData(paginatedList, awaitingApprovalUserAssociations, lang);
        this.viewData.pagination = paginationElement;
        console.log("5");

        return Promise.resolve(this.viewData);
    }

    private getViewData (confirmedUserAssociations: Associations, awaitingApprovalUserAssociations: Associations, lang: AnyRecord): ViewData {
        const viewData: AnyRecord = {
            buttonHref: constants.YOUR_COMPANIES_ADD_COMPANY_URL
        };
        console.log("6");

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
            console.log("7");

            viewData.associationData = associationData;
            viewData.userHasCompanies = constants.TRUE;
            viewData.viewAndManageUrl = constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL;
            viewData.numberOfInvitations = awaitingApprovalUserAssociations.totalResults;
            viewData.viewInvitationsPageUrl = constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL;
        }
        console.log("8");

        return { ...viewData, lang: lang };
    }
}
