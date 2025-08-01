import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import { Association } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";
import { postInvitation } from "../../../services/associationsService";
import { AuthorisedPerson } from "../../../types/associations";

/**
 * Interface representing the view data required for the
 * SendEmailToBeDigitallyAuthorised page.
 */
export interface SendEmailToBeDigitallyAuthorisedViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    cancelLinkHref: string;
    userEmail: string;
    userDisplayName: string;
}

/**
 * Handler for sending an email invitation to be digitally authorised.
 * Prepares view data and handles POST requests to send invitations.
 */
export class SendEmailToBeDigitallyAuthorisedHandler extends GenericHandler {
    viewData: SendEmailToBeDigitallyAuthorisedViewData;

    /**
     * Constructs a new handler instance and initializes default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_PAGE,
            cancelLinkHref: "",
            backLinkHref: "",
            lang: {},
            companyName: "",
            companyNumber: "",
            userEmail: "",
            userDisplayName: ""
        };
    }

    /**
     * Executes the handler logic for GET or POST requests.
     * - For GET: Prepares view data for rendering.
     * - For POST: Sends an invitation email and updates session data.
     *
     * @param req - Express request object
     * @param method - HTTP method (GET or POST)
     * @returns Promise resolving to the view data for rendering
     */
    async execute (req: Request, method: string): Promise<SendEmailToBeDigitallyAuthorisedViewData> {
        const translations = getTranslationsForView(
            req.lang,
            constants.SEND_EMAIL_INVITATION_TO_BE_DIGITALLY_AUTHORISED_PAGE
        );
        this.viewData.lang = translations;

        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        this.viewData.companyNumber = companyNumber;

        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        this.viewData.companyName = companyName;

        const associationId = req.params.associationId;
        const association: Association = getExtraData(
            req.session,
            `${constants.ASSOCIATIONS_ID}_${associationId}`
        );

        this.viewData.userEmail = association.userEmail;
        this.viewData.userDisplayName =
            association.displayName?.toLowerCase() === constants.NOT_PROVIDED.toLowerCase()
                ? String(translations.not_provided)
                : association.displayName;

        const managePeopleUrl = getManageAuthorisedPeopleFullUrl(
            constants.MANAGE_AUTHORISED_PEOPLE_URL,
            companyNumber
        );
        this.viewData.backLinkHref = this.viewData.cancelLinkHref = managePeopleUrl;

        if (method === constants.POST) {
            await postInvitation(req, companyNumber, association.userEmail);

            const authorisedPerson: AuthorisedPerson = {
                authorisedPersonEmailAddress: association.userEmail,
                authorisedPersonCompanyName: companyName
            };

            setExtraData(req.session, constants.AUTHORISED_PERSON, authorisedPerson);
        }

        return this.viewData;
    }
}
