import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger, { createLogMessage } from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { deleteExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { BaseViewData, AnyRecord } from "../../../types/utilTypes";
import { getInvitations, getUserAssociations } from "../../../services/associationsService";
import { AssociationList, AssociationStatus, InvitationList } from "@companieshouse/api-sdk-node/dist/services/associations/types";
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
        "status": string;
    }[],
    viewAndManageUrl: string;
    removeCompanyUrl: string;
    companyInformationUrl: string;
    authorisationBannerRequestAuthenticationCodeUrl: string;
    restoreDigitalAuthUrl: string;
    removeAuthorisationUrl;
}

/**
 * Handles the "Your Companies" page logic, including fetching user associations,
 * managing pagination, and preparing data for rendering the view.
 */
export class YourCompaniesHandler extends GenericHandler {
    viewData: YourCompaniesViewData;

    constructor () {
        super();
        this.viewData = this.initializeViewData();
    }

    /**
     * Initializes the default view data for the "Your Companies" page.
     * @returns {YourCompaniesViewData} The default view data object.
     */
    private initializeViewData (): YourCompaniesViewData {
        return {
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
            removeCompanyUrl: "",
            companyInformationUrl: "",
            restoreDigitalAuthUrl: "",
            removeAuthorisationUrl: "",
            authorisationBannerRequestAuthenticationCodeUrl: ""
        };
    }

    /**
     * Executes the handler logic for the "Your Companies" page.
     * Fetches user associations, handles search and pagination, and prepares data for rendering.
     *
     * @param {Request} req - The HTTP request object.
     * @returns {Promise<YourCompaniesViewData>} The prepared view data for rendering.
     */
    async execute (req: Request): Promise<YourCompaniesViewData> {
        logger.info(createLogMessage(req.session, `${YourCompaniesHandler.name}.${this.execute.name}`, `GET request to serve Your Companies landing page`));

        deleteExtraData(req.session, constants.REMOVE_AUTHORISATION_COMPANY_NAME);
        deleteExtraData(req.session, constants.REMOVE_AUTHORISATION_COMPANY_NUMBER);

        const search = req.query.search as string;
        const page = req.query.page as string;
        let pageNumber = stringToPositiveInteger(page);
        const itemsPerPage = 10;

        let errorMassage;
        if (search && !validateCompanyNumberSearchString(search)) {
            errorMassage = constants.COMPANY_NUMBER_MUST_ONLY_INCLUDE;
        }

        let confirmedUserAssociations: AssociationList = await getUserAssociations(
            req,
            [AssociationStatus.CONFIRMED, AssociationStatus.MIGRATED],
            errorMassage ? undefined : search,
            pageNumber - 1,
            itemsPerPage
        );
        if (!validatePageNumber(pageNumber, confirmedUserAssociations.totalPages)) {
            pageNumber = 1;
            confirmedUserAssociations = await getUserAssociations(
                req,
                [AssociationStatus.CONFIRMED],
                errorMassage ? undefined : search,
                pageNumber - 1,
                itemsPerPage
            );
        }

        const invites: InvitationList = await getInvitations(req);

        this.clearSessionData(req);

        const lang = this.getLanguageData(req);
        this.viewData.lang = lang;

        this.populateViewData(req, confirmedUserAssociations, invites);
        this.viewData.search = search;

        this.viewData.authorisationBannerRequestAuthenticationCodeUrl = req.lang === "en" ? constants.AUTHORISATION_BANNER_REQUEST_AUTHENTICATION_CODE_URL : `${constants.AUTHORISATION_BANNER_REQUEST_AUTHENTICATION_CODE_URL}.cy`;

        if (errorMassage) {
            this.viewData.errors = { search: { text: errorMassage } };
        }

        this.updateSearchAndPaginationData(search, confirmedUserAssociations, pageNumber, lang);

        return Promise.resolve(this.viewData);
    }

    /**
     * Clears unnecessary session data.
     *
     * @param {Request} req - The HTTP request object.
     */
    private clearSessionData (req: Request): void {
        const sessionKeys = [
            constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR,
            constants.CONFIRM_COMPANY_DETAILS_INDICATOR,
            constants.REMOVE_URL_EXTRA,
            constants.USER_EMAILS_ARRAY,
            constants.CURRENT_COMPANY_NUM,
            constants.REMOVE_COMPANY_URL_EXTRA,
            constants.LAST_REMOVED_COMPANY_NAME,
            constants.LAST_REMOVED_COMPANY_NUMBER,
            constants.YOU_MUST_SELECT_AN_OPTION,
            constants.CONFIRMED_COMPANY_FOR_ASSOCIATION
        ];

        sessionKeys.forEach(key => deleteExtraData(req.session, key));
    }

    /**
     * Retrieves language data for the view.
     *
     * @param {Request} req - The HTTP request object.
     * @returns {AnyRecord} The language data object.
     */
    private getLanguageData (req: Request): AnyRecord {
        const localesServicei18nCh = i18nCh.getInstance();
        return {
            ...getTranslationsForView(req.lang, constants.YOUR_COMPANIES_PAGE),
            ...localesServicei18nCh.getResourceBundle(req.lang, constants.COMPANY_STATUS)
        };
    }

    /**
     * Populates the view data with user associations and invitations.
     *
     * @param {AssociationList} confirmedUserAssociations - The list of confirmed user associations.
     * @param {InvitationList} invitationList - The list of invitations.
     */
    private populateViewData (req: Request, confirmedUserAssociations: AssociationList, invitationList: InvitationList): void {
        this.viewData.numberOfInvitations = invitationList.totalResults;
        if (confirmedUserAssociations.totalResults > 0 && Array.isArray(confirmedUserAssociations.items)) {
            const navigationMiddlewareCheckCompanyNumber: string[] = [];
            this.viewData.associationData = confirmedUserAssociations.items.map(item => {
                navigationMiddlewareCheckCompanyNumber.push(item.companyNumber);
                return {
                    company_name: item.companyName,
                    company_number: item.companyNumber,
                    status: item.status
                };
            });

            this.viewData.userHasCompanies = constants.TRUE;
            this.viewData.viewAndManageUrl = getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL);
            this.viewData.removeCompanyUrl = getFullUrl(constants.REMOVE_COMPANY_URL);
            this.viewData.companyInformationUrl = getFullUrl(constants.COMPANY_INFORMATION_URL);
            this.viewData.removeAuthorisationUrl = getFullUrl(constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_URL);
            this.viewData.restoreDigitalAuthUrl = getFullUrl(constants.CONFIRM_COMPANY_DETAILS_FOR_RESTORING_YOUR_DIGITAL_AUTHORISATION_URL);
            setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER, navigationMiddlewareCheckCompanyNumber);
        }
    }

    /**
     * Updates the view data with search and pagination information.
     *
     * @param {string} search - The search query string.
     * @param {AssociationList} confirmedUserAssociations - The list of confirmed user associations.
     * @param {number} pageNumber - The current page number.
     * @param {AnyRecord} lang - The language data object.
     */
    private updateSearchAndPaginationData (
        search: string,
        confirmedUserAssociations: AssociationList,
        pageNumber: number,
        lang: AnyRecord
    ): void {
        if (confirmedUserAssociations.totalPages > 1 || !!search?.length) {
            this.viewData.displaySearchForm = true;
        }

        this.viewData.showNumOfMatches = !!search?.length && !this.viewData.errors;
        this.viewData.numOfMatches = confirmedUserAssociations.totalResults;

        if (search?.length) {
            this.viewData.userHasCompanies = constants.TRUE;
        }

        if (confirmedUserAssociations.totalResults > 0) {
            const searchQuery = getSearchQuery(search);
            const pagination = buildPaginationElement(
                pageNumber,
                confirmedUserAssociations.totalPages,
                constants.LANDING_URL,
                searchQuery
            );

            setLangForPagination(pagination, lang);

            this.viewData.pagination = pagination;
            this.viewData.pageNumber = pageNumber;
            this.viewData.numberOfPages = confirmedUserAssociations.totalPages;
        }
    }
}
