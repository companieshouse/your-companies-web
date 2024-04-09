import { Request, text } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { getUserAssociations } from "../../../services/associationsService";
import { Associations, AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import {
    setLangForPagination,
    getSearchQuery,
    buildPaginationElement
} from "../../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../../lib/validation/generic";

export class YourCompaniesHandler extends GenericHandler {

    async execute (req: Request): Promise<Record<string, unknown>> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        const search = req.query.search as string;
        const page = req.query.page as string;

        let pageNumber = isNaN(Number(page)) || Number(page) < 1 ? 1 : Number(page);

        const errorMassage = getExtraData(req.session, constants.ERROR_MESSAGE_KEY);

        let confirmedUserAssociations: Associations = await getUserAssociations(req, [AssociationStatus.CONFIRMED], search, pageNumber - 1);

        // validate the page number
        if (!validatePageNumber(pageNumber, confirmedUserAssociations.totalPages)) {
            pageNumber = 1;
            confirmedUserAssociations = await getUserAssociations(req, [AssociationStatus.CONFIRMED], search, pageNumber - 1);
        }

        const awaitingApprovalUserAssociations: Associations = await getUserAssociations(req, [AssociationStatus.AWAITING_APPROVAL]);
        setExtraData(req.session, constants.USER_ASSOCIATIONS, awaitingApprovalUserAssociations);
        const lang = getTranslationsForView(req.t, constants.YOUR_COMPANIES_PAGE);
        this.viewData = this.getViewData(confirmedUserAssociations, awaitingApprovalUserAssociations, lang);
        this.viewData.search = search;
        if (errorMassage) {
            this.viewData.errors = {
                search: {
                    text: errorMassage
                }
            };
        }

        if (confirmedUserAssociations.totalPages > 1 || !!search?.length) {
            this.viewData.displaySearchForm = true;
        }

        // toggles display for number of matches found
        this.viewData.showNumOfMatches = !!search?.length;
        this.viewData.numOfMatches = confirmedUserAssociations.totalResults;

        if (search?.length) {
            this.viewData.userHasCompanies = constants.TRUE;
        }

        if (confirmedUserAssociations.totalResults > 0) {
            const searchQuery = getSearchQuery(search);
            const pagination = buildPaginationElement(pageNumber, confirmedUserAssociations.totalPages, constants.LANDING_URL, searchQuery);

            setLangForPagination(pagination, lang);

            this.viewData.pagination = pagination;
        }

        return Promise.resolve(this.viewData);
    }

    private getViewData (confirmedUserAssociations: Associations, awaitingApprovalUserAssociations: Associations, lang: AnyRecord): ViewData {
        const viewData: AnyRecord = {
            buttonHref: constants.YOUR_COMPANIES_ADD_COMPANY_URL + constants.CLEAR_FORM_TRUE,
            numberOfInvitations: awaitingApprovalUserAssociations.totalResults,
            viewInvitationsPageUrl: constants.YOUR_COMPANIES_COMPANY_INVITATIONS_URL
        };

        if (confirmedUserAssociations.totalResults > 0) {
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
        }

        return { ...viewData, lang: lang };
    }
}
