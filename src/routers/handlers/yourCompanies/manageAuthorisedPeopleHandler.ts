import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import logger from "../../../lib/Logger";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { Associations } from "../../../types/associations";
import { getUrlWithCompanyNumber } from "../../../lib/utils/urlUtils";
import { getCompanyAssociations, removeUserFromCompanyAssociations } from "../../../services/userCompanyAssociationService";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";
import { AnyRecord, ViewData } from "../../../types/util-types";

export class ManageAuthorisedPeopleHandler extends GenericHandler {

    async execute (req: Request): Promise<Record<string, unknown>> {
        logger.info(`GET request to serve People Digitaly Authorised To File Online For This Company page`);
        // ...process request here and return data for the view
        const companyNumber: string = req.params[constants.COMPANY_NUMBER];
        const lang = getTranslationsForView(req.t, constants.MANAGE_AUTHORISED_PEOPLE_PAGE);
        this.viewData = this.getViewData(companyNumber, lang);
        const cancellation: Cancellation = getExtraData(req.session, constants.CANCEL_PERSON);

        if (cancellation && req.originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL)) {
            if (cancellation.cancelPerson === constants.YES) {
                const isUserRemovedFromCompanyAssociations = (await removeUserFromCompanyAssociations(cancellation.userEmail, cancellation.companyNumber)) === constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS;
                if (isUserRemovedFromCompanyAssociations) {
                    this.viewData.cancelledPerson = cancellation.userEmail;
                }
            }
        }
        const authorisedPerson = getExtraData(req.session, constants.AUTHORISED_PERSON);

        if (authorisedPerson && req.originalUrl.includes("/confirmation-person-added")) {
            this.viewData.authorisedPersonSuccess = true;
            this.viewData.authorisedPersonEmailAddress = authorisedPerson.authorisedPersonEmailAddress;
            this.viewData.authorisedPersonCompanyName = authorisedPerson.authorisedPersonCompanyName;
        }

        const resentSuccessEmail = getExtraData(req.session, constants.RESENT_SUCCESS_EMAIL);
        if (resentSuccessEmail && req.originalUrl.includes(constants.AUTHORISATION_EMAIL_RESENT_URL)) {
            this.viewData.showEmailResentSuccess = true;
            this.viewData.resentSuccessEmail = resentSuccessEmail;
        }

        const companyAssociations: Associations = await getCompanyAssociations(companyNumber, cancellation);
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
            buttonHref: getUrlWithCompanyNumber(constants.YOUR_COMPANIES_ADD_PRESENTER_URL, companyNumber),
            cancelUrl: constants.YOUR_COMPANIES_CANCEL_PERSON_URL,
            resendEmailUrl: constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_EMAIL_RESENT_URL,
            removeUrl: constants.YOUR_COMPANIES_AUTHENTICATION_CODE_REMOVE_URL
        };
    }
}
