import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger, { createLogMessage } from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getManageAuthorisedPeopleFullUrl, getFullUrl, getAddPresenterFullUrl, getManageAuthorisedPeopleUrl } from "../../../lib/utils/urlUtils";
import { Association, AssociationList, AssociationStatus } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { getCompanyAssociations, isOrWasCompanyAssociatedWithUser, searchForCompanyAssociationByEmail } from "../../../services/associationsService";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { ViewDataWithBackLink, AnyRecord } from "../../../types/utilTypes";
import { buildPaginationElement, setLangForPagination, stringToPositiveInteger } from "../../../lib/helpers/buildPaginationHelper";
import { validateEmailString, validatePageNumber } from "../../../lib/validation/generic";
import { AssociationState, AssociationStateResponse, AuthorisedPerson } from "../../../types/associations";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { Pagination } from "../../../types/pagination";
import { getSearchStringEmail } from "../../../routers/controllers/manageAuthorisedPeopleController";

interface ManageAuthorisedPeopleViewData extends ViewDataWithBackLink, Pagination {
    buttonHref: string;
    resendEmailUrl: string;
    removeUrl: string;
    restoreDigitalAuthBaseUrl: string;
    matomoAddNewAuthorisedPersonGoalId: string;
    companyAssociations: AssociationList | undefined;
    cancelledPerson: string;
    removedPerson: string;
    notRestoredPerson: string;
    changeCompanyAuthCodeUrl: string | undefined;
    showEmailResentSuccess: boolean;
    resentSuccessEmail: string;
    authorisedPersonSuccess: boolean;
    authorisedPersonEmailAddress: string | undefined;
    authorisedPersonCompanyName: string | undefined;
    companyName: string;
    companyNumber: string;
    searchEmail: string | null;
    validSearch?: boolean;
    resultsFound?: boolean;
    cancelSearchHref:string;
    manageAuthorisedPeopleUrl: string;
    }

export const setCompanyName = (req: Request, companyName: string, companyNumber:string): void => {

    const companyNameCollection = getExtraData(req.session, "companyNameCollection") || {};
    companyNameCollection[companyNumber] = companyName;
    setExtraData(req.session, "companyNameCollection", companyNameCollection);
};

export const getCompanyName = (req: Request, companyNumber: string): string | undefined => {
    const companyNameCollection = getExtraData(req.session, "companyNameCollection");
    return companyNameCollection?.[companyNumber];
};
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
            matomoAddNewAuthorisedPersonGoalId: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID,
            companyAssociations: undefined,
            pagination: undefined,
            pageNumber: 0,
            numberOfPages: 0,
            cancelledPerson: "",
            removedPerson: "",
            notRestoredPerson: "",
            changeCompanyAuthCodeUrl: undefined,
            showEmailResentSuccess: false,
            resentSuccessEmail: "",
            authorisedPersonSuccess: false,
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
            cancelSearchHref: `${getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber)}?${constants.CANCEL_SEARCH}`,
            companyNumber,
            lang: getTranslationsForView(req.lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE),
            buttonHref: getAddPresenterFullUrl(companyNumber) + constants.CLEAR_FORM_TRUE,
            manageAuthorisedPeopleUrl: getFullUrl(getManageAuthorisedPeopleUrl(companyNumber))
        };

        await this.preventUnauthorisedAccess(req, companyNumber);

        const searchEmail = getSearchStringEmail(req, companyNumber);

        const isSearchString = typeof searchEmail === "string";
        this.viewData.searchEmail = isSearchString ? searchEmail : null;
        this.viewData.validSearch = isSearchString && validateEmailString(searchEmail);

        if (isSearchString && !this.viewData.validSearch) {
            this.viewData.errors = { searchEmail: { text: constants.ERRORS_EMAIL_INVALID } };
            this.viewData.resultsFound = false;
        }

        let companyAssociations: AssociationList | undefined;
        if (!isSearchString || !this.viewData.validSearch) {

            companyAssociations = await this.getValidCompanyAssociations(req, companyNumber, pageNumber);
            if (companyAssociations?.items?.[0]?.companyName) {

                this.viewData.companyName = companyAssociations.items[0].companyName;

                setCompanyName(req, companyAssociations.items[0].companyName, companyNumber);

            }
        } else {
            this.viewData.validSearch = true;
            await this.handleSearch(req, companyNumber, searchEmail);
        }

        this.handleRemoveConfirmation(req);
        this.handleConfirmationPersonAdded(req);
        this.handleResentSuccessEmail(req);

        if (companyAssociations) {
            this.setupAssociationsData(req, companyNumber, companyAssociations, pageNumber, this.viewData.lang);
        }

        return this.viewData;
    }

    private async getValidCompanyAssociations (req: Request, companyNumber: string, pageNumber: number): Promise<AssociationList> {
        let companyAssociations = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1);
        if (!validatePageNumber(pageNumber, companyAssociations.totalPages)) {
            pageNumber = 1;
            companyAssociations = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1);
        }
        return companyAssociations;
    }

    private setupAssociationsData (
        req: Request,
        companyNumber: string,
        companyAssociations: AssociationList,
        pageNumber: number,
        lang: AnyRecord
        //  viewData: ManageAuthorisedPeopleViewData
    ) {
        const emailArray: string[] = [];
        const associationIdArray: string[] = [];
        for (const association of companyAssociations.items) {
            emailArray.push(association.userEmail);
            associationIdArray.push(association.id);
            setExtraData(req.session, `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
        }

        this.viewData.companyAssociations = companyAssociations;

        if (companyAssociations.totalPages > 1) {

            const urlPrefix = getManageAuthorisedPeopleFullUrl(req.originalUrl, companyNumber);
            const pagination = buildPaginationElement(pageNumber, companyAssociations.totalPages, urlPrefix, "");

            setLangForPagination(pagination, lang);
            this.viewData.pagination = pagination;
            this.viewData.pageNumber = pageNumber;
            this.viewData.numberOfPages = companyAssociations.totalPages;
        }

        const href = getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, companyNumber);

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
     * Handles the confirmation of a person being removed.
     * @param req - The HTTP request object.
     */
    private handleRemoveConfirmation (req: Request) {
        const removal = getExtraData(req.session, constants.REMOVE_PERSON);
        if (removal && req.originalUrl.includes(constants.CONFIRMATION_PERSON_REMOVED_URL)) {
            if (removal.status === AssociationStatus.AWAITING_APPROVAL) {
                this.viewData.cancelledPerson = removal.userEmail;
            } else if (removal.status === AssociationStatus.CONFIRMED) {
                this.viewData.removedPerson = removal.userName;
                this.viewData.changeCompanyAuthCodeUrl = req.lang === "en" ? constants.CHANGE_COMPANY_AUTH_CODE_URL_ENGLISH : constants.CHANGE_COMPANY_AUTH_CODE_URL_WELSH;
            } else if (removal.status === AssociationStatus.MIGRATED) {
                this.viewData.notRestoredPerson = removal.userName;
            }
        }
    }

    /**
     * Handles the success message for a resent email.
     * @param req - The HTTP request object.
     */
    private handleResentSuccessEmail (req: Request) {
        const resentSuccessEmail: string = getExtraData(req.session, constants.RESENT_SUCCESS_EMAIL);

        if (resentSuccessEmail && req.originalUrl.includes(constants.AUTHORISATION_EMAIL_RESENT_URL)) {
            this.viewData.showEmailResentSuccess = true;
            this.viewData.resentSuccessEmail = resentSuccessEmail;
        }
    }

    /**
     * Handles the confirmation of a person being added.
     * @param req - The HTTP request object.
     */
    private handleConfirmationPersonAdded (req: Request) {
        const authorisedPerson: AuthorisedPerson = getExtraData(req.session, constants.AUTHORISED_PERSON);

        if (authorisedPerson &&
            (req.originalUrl.includes(constants.CONFIRMATION_PERSON_ADDED_URL) ||
                req.originalUrl.includes(constants.CONFIRMATION_DIGITAL_AUTHORISATION_RESTORED_URL))
        ) {
            this.viewData.authorisedPersonSuccess = true;
            this.viewData.authorisedPersonEmailAddress = authorisedPerson.authorisedPersonEmailAddress;
            this.viewData.authorisedPersonCompanyName = authorisedPerson.authorisedPersonCompanyName;
        }
    }

    private async handleSearch (req: Request, companyNumber: string, searchStringEmail: string): Promise<void> {
        const result = await searchForCompanyAssociationByEmail(companyNumber, searchStringEmail.toLowerCase());

        if (result === null) {
            this.viewData.resultsFound = false;
            this.viewData.companyName = getCompanyName(req, companyNumber) || "";
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
        this.viewData.companyName = result.companyName || "";
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
