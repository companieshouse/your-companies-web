import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { deleteExtraData } from "../../../lib/utils/sessionUtils";
import { BaseViewData } from "../../../types/utilTypes";
import { getInvitations, getUserAssociations } from "../../../services/associationsService";
import { AssociationList, AssociationStatus, InvitationList } from "private-api-sdk-node/dist/services/associations/types";
import {
    setLangForPagination,
    getSearchQuery,
    buildPaginationElement,
    stringToPositiveInteger
} from "../../../lib/helpers/buildPaginationHelper";
import { validateCompanyNumberSearchString, validatePageNumber } from "../../../lib/validation/generic";
import { i18nCh } from "@companieshouse/ch-node-utils";
import { getFullUrl } from "../../../lib/utils/urlUtils";
import { Pagination } from "../../../types/pagination";

interface YourCompaniesViewData extends BaseViewData, Pagination {
    buttonHref: string;
    search: string;
    displaySearchForm: boolean;
    showNumOfMatches: boolean;
    numOfMatches: number;
    userHasCompanies: string;
    numberOfInvitations: number;
    viewInvitationsPageUrl: string;
    cancelSearchHref: string;
    matomoAddCompanyGoalId: string;
    associationData: {
        "company_name": string;
        "company_number": string;
        "company_status": string;
    }[],
    viewAndManageUrl: string;
    removeCompanyUrl: string;
}

export class YourCompaniesHandler extends GenericHandler {
    viewData: YourCompaniesViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.YOUR_COMPANIES_PAGE,
            buttonHref: getFullUrl(constants.ADD_COMPANY_URL) + constants.CLEAR_FORM_TRUE,
            lang: {},
            viewInvitationsPageUrl: getFullUrl(constants.COMPANY_INVITATIONS_URL),
            cancelSearchHref: constants.LANDING_URL,
            matomoAddCompanyGoalId: constants.MATOMO_ADD_COMPANY_GOAL_ID,
            search: "",
            displaySearchForm: false,
            showNumOfMatches: false,
            numOfMatches: 0,
            userHasCompanies: "",
            pagination: undefined,
            pageNumber: 0,
            numberOfPages: 0,
            numberOfInvitations: 0,
            associationData: [],
            viewAndManageUrl: "",
            removeCompanyUrl: ""
        };
    }

    async execute (req: Request): Promise<YourCompaniesViewData> {
        logger.info(`GET request to serve Your Companies landing page`);
        // ...process request here and return data for the view
        const search = req.query.search as string;
        const page = req.query.page as string;

        let pageNumber = stringToPositiveInteger(page);

        let errorMassage;
        if (search && !validateCompanyNumberSearchString(search)) {
            errorMassage = constants.COMPANY_NUMBER_MUST_ONLY_INCLUDE;
        }

        let confirmedUserAssociations: AssociationList = await getUserAssociations(req, [AssociationStatus.CONFIRMED], errorMassage ? undefined : search, pageNumber - 1);

        // validate the page number
        if (!validatePageNumber(pageNumber, confirmedUserAssociations.totalPages)) {
            pageNumber = 1;
            confirmedUserAssociations = await getUserAssociations(req, [AssociationStatus.CONFIRMED], errorMassage ? undefined : search, pageNumber - 1);
        }

        const invites: InvitationList = await getInvitations(req);

        deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
        deleteExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR);
        deleteExtraData(req.session, constants.REMOVE_URL_EXTRA);
        deleteExtraData(req.session, constants.USER_EMAILS_ARRAY);
        deleteExtraData(req.session, constants.CURRENT_COMPANY_NUM);
        deleteExtraData(req.session, constants.REMOVE_COMPANY_URL_EXTRA);
        deleteExtraData(req.session, constants.LAST_REMOVED_COMPANY_NAME);
        deleteExtraData(req.session, constants.LAST_REMOVED_COMPANY_NUMBER);
        deleteExtraData(req.session, constants.YOU_MUST_SELECT_AN_OPTION);

        const localesServicei18nCh = i18nCh.getInstance();
        const lang = {
            ...getTranslationsForView(req.lang, constants.YOUR_COMPANIES_PAGE),
            ...localesServicei18nCh.getResourceBundle(req.lang, constants.COMPANY_STATUS)
        };
        this.viewData.lang = lang;

        this.getViewData(confirmedUserAssociations, invites);
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
        this.viewData.showNumOfMatches = !!search?.length && !this.viewData.errors;
        this.viewData.numOfMatches = confirmedUserAssociations.totalResults;

        if (search?.length) {
            this.viewData.userHasCompanies = constants.TRUE;
        }

        if (confirmedUserAssociations.totalResults > 0) {
            const searchQuery = getSearchQuery(search);
            const pagination = buildPaginationElement(pageNumber, confirmedUserAssociations.totalPages, constants.LANDING_URL, searchQuery);

            setLangForPagination(pagination, lang);

            this.viewData.pagination = pagination;
            this.viewData.pageNumber = pageNumber;
            this.viewData.numberOfPages = confirmedUserAssociations.totalPages;
        }

        return Promise.resolve(this.viewData);
    }

    private getViewData (confirmedUserAssociations: AssociationList, invitationList: InvitationList): void {
        this.viewData.numberOfInvitations = invitationList.totalResults;

        if (confirmedUserAssociations.totalResults > 0 && Array.isArray(confirmedUserAssociations.items)) {
            const associationData = confirmedUserAssociations.items.map(item => ({
                company_name: item.companyName,
                company_number: item.companyNumber,
                company_status: item.companyStatus
            }));

            this.viewData.associationData = associationData;
            this.viewData.userHasCompanies = constants.TRUE;
            this.viewData.viewAndManageUrl = getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL);
            this.viewData.removeCompanyUrl = getFullUrl(constants.REMOVE_COMPANY_URL);
        }
    }
}
