import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getUrlWithCompanyNumber, getManageAuthorisedPeopleUrl, getFullUrl } from "../../../lib/utils/urlUtils";
import { AssociationList } from "private-api-sdk-node/dist/services/associations/types";
import { getCompanyAssociations, isOrWasCompanyAssociatedWithUser, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";
import { ViewDataWithBackLink } from "../../../types/util-types";
import { Removal } from "../../../types/removal";
import { buildPaginationElement, setLangForPagination, stringToPositiveInteger } from "../../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../../lib/validation/generic";
import { AssociationState, AssociationStateResponse, AuthorisedPerson } from "../../../types/associations";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { PaginationData } from "types/pagination";

interface ManageAuthorisedPeopleViewData extends ViewDataWithBackLink {
    buttonHref: string;
    cancelUrl: string;
    resendEmailUrl: string;
    removeUrl: string;
    matomoAddNewAuthorisedPersonGoalId: string;
    companyAssociations: AssociationList | undefined;
    pagination: PaginationData | undefined;
    pageNumber: number;
    numberOfPages: number;
    cancelledPerson: string;
    removedPerson: string;
    changeCompanyAuthCodeUrl: string | undefined;
    showEmailResentSuccess: boolean;
    resentSuccessEmail: string;
    authorisedPersonSuccess: boolean;
    authorisedPersonEmailAddress: string | undefined;
    authorisedPersonCompanyName: string | undefined;
}

export class ManageAuthorisedPeopleHandler extends GenericHandler {
    viewData: ManageAuthorisedPeopleViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
            backLinkHref: getFullUrl(constants.LANDING_URL),
            lang: {},
            buttonHref: "",
            cancelUrl: "",
            resendEmailUrl: getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL),
            removeUrl: getFullUrl(constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL),
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

    async execute (req: Request): Promise<ManageAuthorisedPeopleViewData> {
        logger.info(`GET request to serve People Digitaly Authorised To File Online For This Company page`);
        // ...process request here and return data for the view
        const page = req.query.page as string;
        let pageNumber = stringToPositiveInteger(page);

        deleteExtraData(req.session, constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
        deleteExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
        const companyNumber: string = req.params[constants.COMPANY_NUMBER];

        await this.preventUnauthorisedAccess(req, companyNumber);

        const lang = getTranslationsForView(req.lang, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
        this.viewData.lang = lang;
        this.viewData.buttonHref = getUrlWithCompanyNumber(getFullUrl(constants.ADD_PRESENTER_URL), companyNumber) + constants.CLEAR_FORM_TRUE;
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

        const emailArray = [];

        for (let i = 0; i < companyAssociations.items.length; i++) {
            emailArray.push(companyAssociations?.items[i]?.userEmail);
        }

        this.viewData.companyAssociations = companyAssociations;

        if (companyAssociations.totalPages > 1) {
            const urlPrefix = getManageAuthorisedPeopleUrl(req.originalUrl, companyNumber);
            const pagination = buildPaginationElement(pageNumber, companyAssociations.totalPages, urlPrefix, "");
            setLangForPagination(pagination, lang);
            this.viewData.pagination = pagination;
            this.viewData.pageNumber = pageNumber;
            this.viewData.numberOfPages = companyAssociations.totalPages;
        }

        const href = getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL).replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
        setExtraData(req.session, constants.REFERER_URL, href);
        setExtraData(req.session, constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
        setExtraData(req.session, constants.COMPANY_NUMBER, companyNumber);
        setExtraData(req.session, constants.USER_EMAILS_ARRAY, emailArray);
        return Promise.resolve(this.viewData);
    }

    private async preventUnauthorisedAccess (req: Request, companyNumber: string) {
        const isAssociated: AssociationStateResponse = await isOrWasCompanyAssociatedWithUser(req, companyNumber);
        if (isAssociated.state !== AssociationState.COMPANY_ASSOCIATED_WITH_USER) {
            const errorText = `${ManageAuthorisedPeopleHandler.name} ${this.preventUnauthorisedAccess.name}: Unauthorised, redirecting to your companies`;
            return Promise.reject(createError(StatusCodes.FORBIDDEN, errorText, { redirctToYourCompanies: true }));
        }
        return Promise.resolve();
    }

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

    private async handleRemoveConfirmation (req: Request) {
        const removal: Removal = getExtraData(req.session, constants.REMOVE_PERSON);
        if (removal && req.originalUrl.includes(constants.CONFIRMATION_PERSON_REMOVED_URL)) {
            this.viewData.removedPerson = removal.userName ? removal.userName : removal.userEmail;
            this.viewData.changeCompanyAuthCodeUrl = constants.CHANGE_COMPANY_AUTH_CODE_URL;
        }
    }

    private isUserRemovedFromCompanyAssociations (req: Request): boolean {
        return getExtraData(req.session, constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS) === constants.TRUE;
    }

    private async callRemoveUserFromCompanyAssociations (req: Request, associationId: string) {
        const isUserRemovedFromCompanyAssociations = (await removeUserFromCompanyAssociations(req, associationId)) === constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS;
        if (isUserRemovedFromCompanyAssociations) {
            setExtraData(req.session, constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS, constants.TRUE);
        }
    }

    private handleResentSuccessEmail (req: Request) {
        const resentSuccessEmail: string = getExtraData(req.session, constants.RESENT_SUCCESS_EMAIL);
        if (resentSuccessEmail && req.originalUrl.includes(constants.AUTHORISATION_EMAIL_RESENT_URL)) {
            this.viewData.showEmailResentSuccess = true;
            this.viewData.resentSuccessEmail = resentSuccessEmail;
        }
    }

    private handleConfirmationPersonAdded (req: Request) {
        const authorisedPerson: AuthorisedPerson = getExtraData(req.session, constants.AUTHORISED_PERSON);
        if (authorisedPerson && req.originalUrl.includes(constants.CONFIRMATION_PERSON_ADDED)) {
            this.viewData.authorisedPersonSuccess = true;
            this.viewData.authorisedPersonEmailAddress = authorisedPerson.authorisedPersonEmailAddress;
            this.viewData.authorisedPersonCompanyName = authorisedPerson.authorisedPersonCompanyName;
        }
    }
}
