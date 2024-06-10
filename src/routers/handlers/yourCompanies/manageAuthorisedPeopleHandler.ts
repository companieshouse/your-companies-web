import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getUrlWithCompanyNumber } from "../../../lib/utils/urlUtils";
import { Association, AssociationStatus, AssociationList } from "private-api-sdk-node/dist/services/associations/types";
import { getCompanyAssociations, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { Removal } from "../../../types/removal";

export class ManageAuthorisedPeopleHandler extends GenericHandler {

    async execute (req: Request): Promise<Record<string, unknown>> {
        logger.info(`GET request to serve People Digitaly Authorised To File Online For This Company page`);
        // ...process request here and return data for the view
        deleteExtraData(req.session, constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
        deleteExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
        const companyNumber: string = req.params[constants.COMPANY_NUMBER];
        const lang = getTranslationsForView(req.t, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
        this.viewData = this.getViewData(companyNumber, lang);
        const cancellation: Cancellation = getExtraData(req.session, constants.CANCEL_PERSON);
        const removal: Removal = getExtraData(req.session, constants.REMOVE_PERSON);
        let companyAssociations: AssociationList = await getCompanyAssociations(req, companyNumber);

        try {
            if (cancellation && req.originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL)) {
                deleteExtraData(req.session, constants.REMOVE_PERSON);
                await this.handleCancellation(req, cancellation, companyAssociations);
            } else if (removal && req.originalUrl.includes(constants.CONFIRMATION_PERSON_REMOVED_URL)) {
                deleteExtraData(req.session, constants.CANCEL_PERSON);
                await this.handleRemoval(req, removal, companyAssociations);
            }
        } catch (error) {
            logger.error(`Error on removal/cancellation: ${JSON.stringify(error)}`);
        }

        this.handleConfirmationPersonAdded(req);
        this.handleResentSuccessEmail(req);

        if (cancellation || removal) {
            companyAssociations = await getCompanyAssociations(req, companyNumber);
        }

        companyAssociations.items = companyAssociations.items.filter(
            (association:Association) => association.status === AssociationStatus.CONFIRMED ||
            (association.status === AssociationStatus.AWAITING_APPROVAL &&
            new Date(association.approvalExpiryAt) > new Date())
        );
        this.viewData.companyAssociations = companyAssociations;

        const href = constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
        setExtraData(req.session, constants.REFERER_URL, href);
        setExtraData(req.session, constants.COMPANY_NAME, companyAssociations?.items[0]?.companyName);
        setExtraData(req.session, constants.COMPANY_NUMBER, companyNumber);
        return Promise.resolve(this.viewData);
    }

    private getViewData (companyNumber: string, lang: AnyRecord): ViewData {
        return {
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
            matomoAddNewAuthorisedPersonGoalId: constants.MATOMO_ADD_NEW_AUTHORISED_PERSON_GOAL_ID
        };
    }

    private async handleCancellation (req: Request, cancellation: Cancellation, companyAssociations: AssociationList) {
        if (cancellation.cancelPerson === constants.YES) {
            const associationId = companyAssociations.items.find(
                association => association.companyNumber === cancellation.companyNumber && association.userEmail === cancellation.userEmail
            )?.id as string;
            if (!this.isUserRemovedFromCompanyAssociations(req) && associationId) {
                this.callRemoveUserFromCompanyAssociations(req, associationId);
            }
            this.viewData.cancelledPerson = cancellation.userEmail;
        }
    }

    private async handleRemoval (req: Request, removal: Removal, companyAssociations: AssociationList) {
        if (removal.removePerson === constants.CONFIRM) {
            const associationId = companyAssociations.items.find(
                (association:Association) => association.companyNumber === removal.companyNumber && association.userEmail === removal.userEmail
            )?.id as string;
            if (!this.isUserRemovedFromCompanyAssociations(req) && associationId) {
                this.callRemoveUserFromCompanyAssociations(req, associationId);
            }
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
