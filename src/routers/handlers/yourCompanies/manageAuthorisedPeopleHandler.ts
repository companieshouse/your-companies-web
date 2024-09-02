import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getUrlWithCompanyNumber, getManageAuthorisedPeopleUrl } from "../../../lib/utils/urlUtils";
import { AssociationList } from "private-api-sdk-node/dist/services/associations/types";
import { getCompanyAssociations, isOrWasCompanyAssociatedWithUser, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { Removal } from "../../../types/removal";
import { buildPaginationElement, setLangForPagination, stringToPositiveInteger } from "../../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../../lib/validation/generic";
import { AssociationState, AssociationStateResponse } from "../../../types/associations";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";

export class ManageAuthorisedPeopleHandler extends GenericHandler {

    async execute (req: Request): Promise<Record<string, unknown>> {
        logger.info(`GET request to serve People Digitaly Authorised To File Online For This Company page`);
        // ...process request here and return data for the view
        const page = req.query.page as string;
        let pageNumber = stringToPositiveInteger(page);

        deleteExtraData(req.session, constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
        deleteExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
        const companyNumber: string = req.params[constants.COMPANY_NUMBER];

        await this.preventUnauthorisedAccess(req, companyNumber);

        const lang = getTranslationsForView(req.t, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
        this.viewData = this.getViewData(companyNumber, lang);
        const cancellation: Cancellation = getExtraData(req.session, constants.CANCEL_PERSON);
        let companyAssociations: AssociationList = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1);
        if (!validatePageNumber(pageNumber, companyAssociations.totalPages)) {
            pageNumber = 1;
            companyAssociations = await getCompanyAssociations(req, companyNumber, undefined, undefined, pageNumber - 1);
        }

        try {
            if (cancellation && req.originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL)) {
                deleteExtraData(req.session, constants.REMOVE_PERSON);
                await this.handleCancellation(req, cancellation, companyNumber);
            }
        } catch (error) {
            logger.error(`Error on cancellation: ${JSON.stringify(error)}`);
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

        const href = constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
        setExtraData(req.session, constants.REFERER_URL, href);
        setExtraData(req.session, constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
        setExtraData(req.session, constants.COMPANY_NUMBER, companyNumber);
        setExtraData(req.session, constants.USER_EMAILS_ARRAY, emailArray);
        return Promise.resolve(this.viewData);
    }

    private async preventUnauthorisedAccess (req: Request, companyNumber: string) {
        const isAssociated: AssociationStateResponse = await isOrWasCompanyAssociatedWithUser(req, companyNumber);
        if (isAssociated.state !== AssociationState.COMPNANY_ASSOCIATED_WITH_USER) {
            return Promise.reject(createError(StatusCodes.FORBIDDEN));
        }
    }

    private getViewData (companyNumber: string, lang: AnyRecord): ViewData {
        return {
            templateName: constants.MANAGE_AUTHORISED_PEOPLE_PAGE,
            lang: lang,
            backLinkHref: constants.LANDING_URL,
            buttonHref: getUrlWithCompanyNumber(constants.YOUR_COMPANIES_ADD_PRESENTER_URL, companyNumber) + constants.CLEAR_FORM_TRUE,
            cancelUrl: constants.YOUR_COMPANIES_COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber),
            resendEmailUrl: constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            removeUrl: constants.YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL,
            matomoAddNewAuthorisedPersonButton: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_BUTTON,
            matomoRemoveAuthorisedUserLink: constants.MATOMO_REMOVE_AUTHORISED_USER_LINK,
            matomoCancelAuthorisedUserLink: constants.MATOMO_CANCEL_AUTHORISED_USER_LINK,
            matomoResendAuthorisedUserEmailLink: constants.MATOMO_RESEND_AUTHORISED_USER_EMAIL_LINK,
            matomoAddNewAuthorisedPersonGoalId: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID,
            matomoBackToYourCompaniesLink: constants.MATOMO_BACK_TO_YOUR_COMPANIES_LINK
        };
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
            this.viewData.changeCompanyAuthCodeUrl = "https://www.gov.uk/guidance/company-authentication-codes-for-online-filing#change-or-cancel-your-code";
            this.viewData.matomoChangeTheAuthenticationCodeLink = constants.MATOMO_CHANGE_THE_AUTHENTICATION_CODE_LINK;
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
        const resentSuccessEmail = getExtraData(req.session, constants.RESENT_SUCCESS_EMAIL);
        if (resentSuccessEmail && req.originalUrl.includes(constants.AUTHORISATION_EMAIL_RESENT_URL)) {
            this.viewData.showEmailResentSuccess = true;
            this.viewData.resentSuccessEmail = resentSuccessEmail;
        }
    }

    private handleConfirmationPersonAdded (req: Request) {
        const authorisedPerson = getExtraData(req.session, constants.AUTHORISED_PERSON);
        if (authorisedPerson && req.originalUrl.includes("/confirmation-person-added")) {
            this.viewData.authorisedPersonSuccess = true;
            this.viewData.authorisedPersonEmailAddress = authorisedPerson.authorisedPersonEmailAddress;
            this.viewData.authorisedPersonCompanyName = authorisedPerson.authorisedPersonCompanyName;
        }
    }
}
