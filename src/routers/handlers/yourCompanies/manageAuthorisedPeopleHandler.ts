import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { Associations } from "../../../types/associations";
import { getUrlWithCompanyNumber } from "../../../lib/utils/urlUtils";
import { getCompanyAssociations, removeUserFromCompanyAssociations } from "../../../services/userCompanyAssociationService";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";
import { AnyRecord, ViewData } from "../../../types/util-types";
import { Removal } from "../../../types/removal";

export class ManageAuthorisedPeopleHandler extends GenericHandler {

    async execute (req: Request): Promise<Record<string, unknown>> {
        logger.info(`GET request to serve People Digitaly Authorised To File Online For This Company page`);
        // ...process request here and return data for the view
        const companyNumber: string = req.params[constants.COMPANY_NUMBER];
        const lang = getTranslationsForView(req.t, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
        this.viewData = this.getViewData(companyNumber, lang);
        const cancellation: Cancellation = getExtraData(req.session, constants.CANCEL_PERSON);
        const removal: Removal = getExtraData(req.session, constants.REMOVE_PERSON);

        if (cancellation && req.originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL)) {
            deleteExtraData(req.session, constants.REMOVE_PERSON);
            await this.handleCancellation(cancellation);
        } else if (removal && req.originalUrl.includes(constants.CONFIRMATION_PERSON_REMOVED_URL)) {
            deleteExtraData(req.session, constants.CANCEL_PERSON);
            await this.handleRemoval(removal);
        }

        this.handleConfirmationPersonAdded(req);
        this.handleResentSuccessEmail(req);

        const companyAssociations: Associations = await getCompanyAssociations(companyNumber, cancellation || removal);
        this.viewData.companyAssociations = companyAssociations;
        const href = constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
        setExtraData(req.session, constants.REFERER_URL, href);
        setExtraData(req.session, constants.COMPANY_NAME, companyAssociations.items[0].companyName);
        setExtraData(req.session, constants.COMPANY_NUMBER, companyNumber);
        return Promise.resolve(this.viewData);
    }

    private getViewData (companyNumber: string, lang: AnyRecord): ViewData {
        return {
            lang: lang,
            backLinkHref: constants.LANDING_URL,
            buttonHref: getUrlWithCompanyNumber(constants.YOUR_COMPANIES_BEFORE_ADD_PRESENTER_URL, companyNumber),
            cancelUrl: constants.YOUR_COMPANIES_COMPANY_AUTH_PROTECTED_CANCEL_PERSON_URL.replace(`:${constants.COMPANY_NUMBER}`, companyNumber),
            resendEmailUrl: constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            removeUrl: constants.YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL
        };
    }

    private async handleCancellation (cancellation: Cancellation) {
        if (cancellation.cancelPerson === constants.YES) {
            const isUserRemovedFromCompanyAssociations = (await removeUserFromCompanyAssociations(cancellation.userEmail, cancellation.companyNumber)) === constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS;
            if (isUserRemovedFromCompanyAssociations) {
                this.viewData.cancelledPerson = cancellation.userEmail;
            }
        }
    }

    private async handleRemoval (removal: Removal) {
        if (removal.removePerson === constants.CONFIRM) {
            const isUserRemovedFromCompanyAssociations = (await removeUserFromCompanyAssociations(removal.userEmail, removal.companyNumber)) === constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS;
            if (isUserRemovedFromCompanyAssociations) {
                this.viewData.removedPerson = removal.userName ? removal.userName : removal.userEmail;
                this.viewData.changeCompanyAuthCodeUrl = "https://www.gov.uk/guidance/company-authentication-codes-for-online-filing#change-or-cancel-your-code";
            }
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
