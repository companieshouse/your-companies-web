import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { ViewData } from "../../../types/util-types";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getUrlWithCompanyNumber } from "../../../lib/utils/urlUtils";
import { postInvitation } from "../../../services/associationsService";
import { AuthorisedPerson } from "types/associations";

export class CheckPresenterHandler extends GenericHandler {

    async execute (req: Request, method: string): Promise<ViewData> {
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        const emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        this.viewData = await this.getViewData(req, companyNumber, companyName, emailAddress);
        if (method === constants.POST) {
            try {
                await postInvitation(req, companyNumber, emailAddress);
                const authorisedPerson: AuthorisedPerson = {
                    authorisedPersonEmailAddress: emailAddress,
                    authorisedPersonCompanyName: companyName
                };
                // save the details of the successfully authorised person
                setExtraData(req.session, constants.AUTHORISED_PERSON, authorisedPerson);
                // remove the to be authorised person email
                deleteExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
            } catch (error) {
                this.viewData.associationAlreadyExist = true;
            }
        }
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request, companyNumber: string, companyName: string, emailAddress: string): Promise<ViewData> {
        const translations = getTranslationsForView(req.t, constants.CHECK_PRESENTER_PAGE);
        const url = getUrlWithCompanyNumber(constants.YOUR_COMPANIES_ADD_PRESENTER_URL, companyNumber);

        return {
            lang: translations,
            companyName: companyName,
            companyNumber: companyNumber,
            emailAddress,
            backLinkHref: url,
            backLinkWithClearForm: url + constants.CLEAR_FORM_TRUE,
            matomoConfirmAndSendEmailButton: constants.MATOMO_CONFIRM_AND_SEND_EMAIL_BUTTON,
            matomoChangeLink: constants.MATOMO_CHANGE_LINK
        };
    }
}
