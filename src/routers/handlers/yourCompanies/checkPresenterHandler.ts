import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getAddPresenterFullUrl } from "../../../lib/utils/urlUtils";
import { postInvitation } from "../../../services/associationsService";
import { AuthorisedPerson } from "../../../types/associations";
import { createAndLogError } from "../../../lib/Logger";

/**
 * Interface representing the view data for the Check Presenter page.
 */
export interface CheckPresenterViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    associationAlreadyExist: boolean;
    emailAddress: string;
    backLinkWithClearForm: string;
}

/**
 * Handler for the Check Presenter page. Manages the view data and handles
 * GET and POST requests for the page.
 */
export class CheckPresenterHandler extends GenericHandler {
    viewData: CheckPresenterViewData;

    /**
     * Initializes the handler with default view data.
     */
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

    /**
     * Executes the handler logic for the Check Presenter page.
     *
     * @param req - The HTTP request object.
     * @param method - The HTTP method (GET or POST).
     * @returns A promise resolving to the view data for the page.
     */
    async execute (req: Request, method: string): Promise<CheckPresenterViewData> {
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        const emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);

        this.populateViewData(req, companyNumber, companyName, emailAddress);

        if (method === constants.POST) {
            await this.handlePostRequest(req, companyNumber, companyName, emailAddress);
        }

        return Promise.resolve(this.viewData);
    }

    /**
     * Populates the view data with the necessary information.
     *
     * @param req - The HTTP request object.
     * @param companyNumber - The company number.
     * @param companyName - The company name.
     * @param emailAddress - The email address of the presenter.
     */
    private populateViewData (req: Request, companyNumber: string, companyName: string, emailAddress: string): void {
        this.viewData.lang = getTranslationsForView(req.lang, constants.CHECK_PRESENTER_PAGE);
        const url = getAddPresenterFullUrl(companyNumber);
        this.viewData.backLinkHref = url;
        this.viewData.backLinkWithClearForm = url + constants.CLEAR_FORM_TRUE;
        this.viewData.companyName = companyName.toUpperCase();
        this.viewData.companyNumber = companyNumber;
        this.viewData.emailAddress = emailAddress;
    }

    /**
     * Handles the POST request logic for the Check Presenter page.
     *
     * @param req - The HTTP request object.
     * @param companyNumber - The company number.
     * @param companyName - The company name.
     * @param emailAddress - The email address of the presenter.
     */
    private async handlePostRequest (req: Request, companyNumber: string, companyName: string, emailAddress: string): Promise<void> {
        try {
            await postInvitation(req, companyNumber, emailAddress);

            const authorisedPerson: AuthorisedPerson = {
                authorisedPersonEmailAddress: emailAddress,
                authorisedPersonCompanyName: companyName
            };

            setExtraData(req.session, constants.AUTHORISED_PERSON, authorisedPerson);
            deleteExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        } catch (error) {
            createAndLogError(`Error posting presenter invitation for company number ${companyNumber} and email ${emailAddress}: ${error}`);
            this.viewData.associationAlreadyExist = true;
        }
    }
}
