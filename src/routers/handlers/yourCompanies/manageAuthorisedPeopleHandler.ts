import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger, { createLogMessage } from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getManageAuthorisedPeopleFullUrl, getFullUrl, getAddPresenterFullUrl } from "../../../lib/utils/urlUtils";
import { AssociationList } from "private-api-sdk-node/dist/services/associations/types";
import { getCompanyAssociations, isOrWasCompanyAssociatedWithUser, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";
import { ViewDataWithBackLink } from "../../../types/utilTypes";
import { Removal } from "../../../types/removal";
import { buildPaginationElement, setLangForPagination, stringToPositiveInteger } from "../../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../../lib/validation/generic";
import { AssociationState, AssociationStateResponse, AuthorisedPerson } from "../../../types/associations";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { Pagination } from "../../../types/pagination";

interface ManageAuthorisedPeopleViewData extends ViewDataWithBackLink, Pagination {
    buttonHref: string;
    cancelUrl: string;
    resendEmailUrl: string;
    removeUrl: string;
    restoreDigitalAuthBaseUrl: string;
    matomoAddNewAuthorisedPersonGoalId: string;
    companyAssociations: AssociationList | undefined;
    cancelledPerson: string;
    removedPerson: string;
    changeCompanyAuthCodeUrl: string | undefined;
    showEmailResentSuccess: boolean;
    resentSuccessEmail: string;
    authorisedPersonSuccess: boolean;
    authorisedPersonEmailAddress: string | undefined;
    authorisedPersonCompanyName: string | undefined;
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
            cancelUrl: "",
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
            changeCompanyAuthCodeUrl: undefined,
            showEmailResentSuccess: false,
            resentSuccessEmail: "",
            authorisedPersonSuccess: false,
            authorisedPersonEmailAddress: undefined,
            authorisedPersonCompanyName: undefined
        };
    }

    /**
     * Executes the handler logic to prepare data for the view.
     * @param req - The HTTP request object.
     */
    async execute (req: Request): Promise<ManageAuthorisedPeopleViewData> {
        logger.info(createLogMessage(req.session, `${ManageAuthorisedPeopleHandler.name}.${this.execute.name}`, `GET request to serve People Digitally Authorised To File Online For This Company page`));

        const page = req.query.page as string;
        let pageNumber = stringToPositiveInteger(page);

        deleteExtraData(req.session, constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
        deleteExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);

        const companyNumber: string = req.params[constants.COMPANY_NUMBER];
        await this.preventUnauthorisedAccess(req, companyNumber);

        const lang = getTranslationsForView(req.lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
        this.viewData.lang = lang;
        this.viewData.buttonHref = getAddPresenterFullUrl(companyNumber) + constants.CLEAR_FORM_TRUE;
        this.viewData.cancelUrl = getFullUrl(constants.COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL).replace(`:${constants.COMPANY_NUMBER}`, companyNumber);

        const cancellation: Cancellation = getExtraData(req.session, constants.CANCEL_PERSON);
        let companyAssociations: AssociationList = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1);

        if (!validatePageNumber(pageNumber, companyAssociations.totalPages)) {
            pageNumber = 1;
            companyAssociations = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1);
        }

        if (cancellation && req.originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL)) {
            deleteExtraData(req.session, constants.REMOVE_PERSON);
            await this.handleCancellation(req, cancellation, companyNumber);
        }

        this.handleRemoveConfirmation(req);
        this.handleConfirmationPersonAdded(req);
        this.handleResentSuccessEmail(req);

        if (cancellation) {
            companyAssociations = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1);
        }

        const emailArray: string[] = [];
        for (const association of companyAssociations.items) {
            emailArray.push(association.userEmail);
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
        setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE, true);

        return Promise.resolve(this.viewData);
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
     * Handles the cancellation of an authorised person.
     * @param req - The HTTP request object.
     * @param cancellation - The cancellation data.
     * @param companyNumber - The company number.
     */
    private async handleCancellation (req: Request, cancellation: Cancellation, companyNumber: string) {
        if (cancellation.cancelPerson === constants.YES) {
            const companyAssociations = await getCompanyAssociations(req, companyNumber, undefined, undefined, undefined, 100000);
            const associationId = companyAssociations.items.find(
                association => association.companyNumber === cancellation.companyNumber && association.userEmail === cancellation.userEmail
            )?.id as string;

            if (!this.isUserRemovedFromCompanyAssociations(req) && associationId) {
                await this.callRemoveUserFromCompanyAssociations(req, associationId);
            }
            this.viewData.cancelledPerson = cancellation.userEmail;
        }
    }

    /**
     * Handles the confirmation of a person being removed.
     * @param req - The HTTP request object.
     */
    private async handleRemoveConfirmation (req: Request) {
        const removal: Removal = getExtraData(req.session, constants.REMOVE_PERSON);
        if (removal && req.originalUrl.includes(constants.CONFIRMATION_PERSON_REMOVED_URL)) {
            this.viewData.removedPerson = removal.userName ? removal.userName : removal.userEmail;
            this.viewData.changeCompanyAuthCodeUrl = constants.CHANGE_COMPANY_AUTH_CODE_URL;
        }
    }

    /**
     * Checks if the user has been removed from company associations.
     * @param req - The HTTP request object.
     */
    private isUserRemovedFromCompanyAssociations (req: Request): boolean {
        return getExtraData(req.session, constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS) === constants.TRUE;
    }

    /**
     * Calls the service to remove a user from company associations.
     * @param req - The HTTP request object.
     * @param associationId - The association ID.
     */
    private async callRemoveUserFromCompanyAssociations (req: Request, associationId: string) {
        const isUserRemovedFromCompanyAssociations = (await removeUserFromCompanyAssociations(req, associationId)) === constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS;
        if (isUserRemovedFromCompanyAssociations) {
            setExtraData(req.session, constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS, constants.TRUE);
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
}
