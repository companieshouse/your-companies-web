import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getFullUrl, getUrlWithCompanyNumber } from "../../../lib/utils/urlUtils";
import { postInvitation } from "../../../services/associationsService";
import { AuthorisedPerson } from "types/associations";

interface CheckPresenterViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    associationAlreadyExist: boolean;
    emailAddress: string;
    backLinkWithClearForm: string;
}

export class CheckPresenterHandler extends GenericHandler {
    viewData: CheckPresenterViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.CHECK_PRESENTER_PAGE,
            backLinkHref: "",
            lang: {},
            companyName: "",
            companyNumber: "",
            emailAddress: "",
            backLinkWithClearForm: "",
            associationAlreadyExist: false
        };
    }

    async execute (req: Request, method: string): Promise<CheckPresenterViewData> {
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        const emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        this.getViewData(req, companyNumber, companyName, emailAddress);

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

    private getViewData (req: Request, companyNumber: string, companyName: string, emailAddress: string): void {
        this.viewData.lang = getTranslationsForView(req.lang, constants.CHECK_PRESENTER_PAGE);
        const url = getUrlWithCompanyNumber(getFullUrl(constants.ADD_PRESENTER_URL), companyNumber);
        this.viewData.backLinkHref = url;
        this.viewData.backLinkWithClearForm = url + constants.CLEAR_FORM_TRUE;
        this.viewData.companyName = companyName;
        this.viewData.companyNumber = companyNumber;
        this.viewData.emailAddress = emailAddress;

    }
}
