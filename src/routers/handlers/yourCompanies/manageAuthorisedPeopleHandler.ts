import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger, { createLogMessage } from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import {
    getManageAuthorisedPeopleFullUrl,
    getFullUrl,
    getAddPresenterFullUrl,
    getManageAuthorisedPeopleUrl
} from "../../../lib/utils/urlUtils";
import { AssociationList } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import {
    getCompanyAssociations,
    isOrWasCompanyAssociatedWithUser,
    searchForCompanyAssociationByEmail
} from "../../../services/associationsService";
import {
    deleteExtraData,
    getCompanyNameFromCollection,
    getSearchStringEmail,
    setCompanyNameInCollection,
    setExtraData
} from "../../../lib/utils/sessionUtils";
import { AnyRecord, ViewDataWithBackLink } from "../../../types/utilTypes";
import {
    buildPaginationElement,
    setLangForPagination,
    stringToPositiveInteger
} from "../../../lib/helpers/buildPaginationHelper";
import { validateEmailString, validatePageNumber } from "../../../lib/validation/generic";
import { AssociationState, AssociationStateResponse } from "../../../types/associations";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { Pagination } from "../../../types/pagination";
import { Session } from "@companieshouse/node-session-handler";

interface ManageAuthorisedPeopleViewData extends ViewDataWithBackLink, Pagination {
    buttonHref: string;
    resendEmailUrl: string;
    removeUrl: string;
    restoreDigitalAuthBaseUrl: string;
    companyAssociations: AssociationList | undefined;
    changeCompanyAuthCodeUrl: string | undefined;
    resentSuccessEmail: string;
    authorisedPersonEmailAddress: string | undefined;
    authorisedPersonCompanyName: string | undefined;
    companyName: string;
    companyNumber: string;
    searchEmail: string | null;
    validSearch?: boolean;
    resultsFound?: boolean;
    cancelSearchHref: string;
    manageAuthorisedPeopleUrl: string;
}

/**
 * Handler for managing authorised people associated with a company.
 */
export class ManageAuthorisedPeopleHandler extends GenericHandler {
    viewData: ManageAuthorisedPeopleViewData;

    constructor () {
        super();
        this.viewData = this.initializeViewData();
    }

    /**
     * Initializes the default view data for the handler.
     */
    private initializeViewData (): ManageAuthorisedPeopleViewData {
        return {
            templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
            backLinkHref: constants.LANDING_URL,
            lang: {},
            buttonHref: "",
            resendEmailUrl: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL),
            removeUrl: getFullUrl(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL),
            restoreDigitalAuthBaseUrl: getFullUrl(constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_BASE_URL),
            companyAssociations: undefined,
            pagination: undefined,
            pageNumber: 0,
            numberOfPages: 0,
            changeCompanyAuthCodeUrl: undefined,
            resentSuccessEmail: "",
            authorisedPersonEmailAddress: undefined,
            authorisedPersonCompanyName: undefined,
            companyName: "",
            companyNumber: "",
            cancelSearchHref: "",
            searchEmail: null,
            manageAuthorisedPeopleUrl: ""
        };
    }

    /**
     * Executes the handler logic to prepare data for the view.
     * @param req - The HTTP request object.
     */
    async execute (req: Request): Promise<ManageAuthorisedPeopleViewData> {
        logger.info(createLogMessage(req.session, `${ManageAuthorisedPeopleHandler.name}.${this.execute.name}`,
            `GET request to serve People Digitally Authorised To File Online For This Company page`)
        );
        setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE_COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE, true);
        deleteExtraData(req.session, constants.REMOVE_PAGE_ERRORS);

        const companyNumber = req.params[constants.COMPANY_NUMBER];
        const pageNumber = stringToPositiveInteger(req.query.page as string);
        this.viewData = {
            ...this.viewData,
            cancelSearchHref: `${getManageAuthorisedPeopleFullUrl(companyNumber)}?${constants.CANCEL_SEARCH}`,
            companyNumber,
            lang: getTranslationsForView(req.lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE),
            buttonHref: getAddPresenterFullUrl(companyNumber) + constants.CLEAR_FORM_TRUE,
            manageAuthorisedPeopleUrl: getFullUrl(getManageAuthorisedPeopleUrl(companyNumber))
        };

        await this.preventUnauthorisedAccess(req, companyNumber);

        const searchEmail = getSearchStringEmail(req.session as Session, companyNumber);

        const isSearchString = typeof searchEmail === "string";
        this.viewData.searchEmail = isSearchString ? searchEmail : null;
        this.viewData.validSearch = isSearchString && validateEmailString(searchEmail);

        if (isSearchString && !this.viewData.validSearch) {
            const errorMessageKey = searchEmail.length === 0 ? constants.ERRORS_EMAIL_NOT_PROVIDED : constants.ERRORS_EMAIL_INVALID;
            this.viewData.errors = { searchEmail: { text: errorMessageKey } };
            this.viewData.resultsFound = false;
        }

        let companyAssociations: AssociationList | undefined;
        if (!isSearchString || !this.viewData.validSearch) {

            companyAssociations = await this.getValidCompanyAssociations(req, companyNumber, pageNumber);
            if (companyAssociations?.items?.[0]?.companyName) {
                this.viewData.companyName = companyAssociations.items[0].companyName.toUpperCase();
                setCompanyNameInCollection(req.session as Session, companyAssociations.items[0].companyName, companyNumber);
            }
        } else {
            this.viewData.validSearch = true;
            await this.handleSearch(req, companyNumber, searchEmail);
        }

        if (companyAssociations) {
            this.setupAssociationsData(req, companyNumber, companyAssociations, pageNumber, this.viewData.lang);
        }

        return this.viewData;
    }

    /**
   * Retrieves a paginated list of valid company associations for a given company number.
   * If the provided page number is invalid, it defaults to the first page.
   *
   * @param req - The Express request object.
   * @param companyNumber - The unique identifier for the company.
   * @param pageNumber - The requested page number (1-based index).
   * @returns A promise that resolves to an {@link AssociationList} containing the company associations for the specified page.
   */
    private async getValidCompanyAssociations (req: Request, companyNumber: string, pageNumber: number): Promise<AssociationList> {
        let companyAssociations = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1, constants.ITEMS_PER_PAGE);
        if (!validatePageNumber(pageNumber, companyAssociations.totalPages)) {
            pageNumber = 1;
            companyAssociations = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1, constants.ITEMS_PER_PAGE);
        }
        return companyAssociations;
    }

    /**
   * Sets up association-related data for the current request and view.
   *
   * This method processes the list of company associations, extracts relevant information
   * (such as user emails and association IDs), and stores them in the session for later use.
   * It also prepares pagination data if there are multiple pages of associations, and sets
   * various session values required for navigation and validation middleware.
   *
   * @param req - The Express request object, used to access the session and original URL.
   * @param companyNumber - The unique identifier for the company whose associations are being managed.
   * @param companyAssociations - The list of associations (users) related to the company, including pagination info.
   * @param pageNumber - The current page number being viewed.
   * @param lang - An object containing language-specific strings for localization.
   */
    private setupAssociationsData (
        req: Request,
        companyNumber: string,
        companyAssociations: AssociationList,
        pageNumber: number,
        lang: AnyRecord
    ) {
        const emailArray: string[] = [];
        const associationIdArray: string[] = [];
        for (const association of companyAssociations.items) {
            emailArray.push(association.userEmail);
            associationIdArray.push(association.id);
            setExtraData(req.session, `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
        }

        this.viewData.companyAssociations = companyAssociations;

        const href = getManageAuthorisedPeopleFullUrl(companyNumber);

        if (companyAssociations.totalPages > 1) {
            const pagination = buildPaginationElement(pageNumber, companyAssociations.totalPages, href, "", lang);

            setLangForPagination(pagination, lang);
            this.viewData.pagination = pagination;
            this.viewData.pageNumber = pageNumber;
            this.viewData.numberOfPages = companyAssociations.totalPages;
        }

        setExtraData(req.session, constants.REFERER_URL, href);
        setExtraData(req.session, constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
        setExtraData(req.session, constants.COMPANY_NUMBER, companyNumber);
        setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_CHECK_COMPANY_NUMBER, companyNumber);
        setExtraData(req.session, constants.USER_EMAILS_ARRAY, emailArray);
        setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_CHECK_USER_EMAIL, emailArray);
        setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_CHECK_ASSOCIATIONS_ID, associationIdArray);
    }

    /**
     * Prevents unauthorized access to the page by validating the user's association with the company.
     * @param req - The HTTP request object.
     * @param companyNumber - The company number.
     */
    private async preventUnauthorisedAccess (req: Request, companyNumber: string) {
        const isAssociated: AssociationStateResponse = await isOrWasCompanyAssociatedWithUser(req, companyNumber);
        if (isAssociated.state !== AssociationState.COMPANY_ASSOCIATED_WITH_USER) {
            const errorText = `${ManageAuthorisedPeopleHandler.name} ${this.preventUnauthorisedAccess.name}: Unauthorised, redirecting to your companies`;
            return Promise.reject(createError(StatusCodes.FORBIDDEN, errorText, { redirctToYourCompanies: true }));
        }
        return Promise.resolve();
    }

    /**
   * Searches for a company association by email address for a given company number,
   * updates the view data with the search results, and sets relevant metadata for rendering.
   *
   * @param req - The Express request object, used to access session data.
   * @param companyNumber - The unique identifier of the company to search within.
   * @param searchStringEmail - The email address to search for, case-insensitive.
   * @returns A promise that resolves when the search and view data update are complete.
   */
    private async handleSearch (req: Request, companyNumber: string, searchStringEmail: string): Promise<void> {
        const result = await searchForCompanyAssociationByEmail(companyNumber, searchStringEmail.toLowerCase());

        if (result === null) {
            this.viewData.resultsFound = false;
            this.viewData.companyName = getCompanyNameFromCollection(req.session as Session, companyNumber) ?? "";
            this.viewData.companyAssociations = {
                items: [],
                itemsPerPage: 1,
                pageNumber: 1,
                totalResults: 0,
                totalPages: 1,
                links: { self: "", next: "" }
            };
            return;
        }

        this.viewData.resultsFound = true;
        this.viewData.companyName = result.companyName;
        this.viewData.companyAssociations = {
            items: [result],
            itemsPerPage: 1,
            pageNumber: 1,
            totalResults: 1,
            totalPages: 1,
            links: { self: "", next: "" }
        };
    }
}
