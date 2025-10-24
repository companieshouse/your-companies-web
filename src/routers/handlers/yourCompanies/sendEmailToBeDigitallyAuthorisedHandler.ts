import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { deleteSearchStringEmail, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import { Association } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";
import { getAssociationById, postInvitation } from "../../../services/associationsService";
import { AuthorisedPerson } from "../../../types/associations";
import { Session } from "@companieshouse/node-session-handler";
import logger, { createLogMessage } from "../../../lib/Logger";

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

        const associationId = req.params.associationId;
        let association: Association | undefined = getExtraData(
            req.session,
            `${constants.ASSOCIATIONS_ID}_${associationId}`
        );

        if (!association) {
            logger.info(
                createLogMessage(
                    req,
                    SendEmailToBeDigitallyAuthorisedHandler.name,
                    `Association not found in session, fetching ${associationId} from api`
                )
            );
            association = await getAssociationById(req, associationId);
            setExtraData(req.session, `${constants.ASSOCIATIONS_ID}_${association.id}`, association);
        }

        this.viewData.userEmail = association.userEmail;
        this.viewData.userDisplayName =
            association.displayName?.toLowerCase() === constants.NOT_PROVIDED.toLowerCase()
                ? String(translations.not_provided)
                : association.displayName;

        const companyNumber = association.companyNumber;
        this.viewData.companyNumber = companyNumber;
        this.viewData.companyName = association.companyName.toUpperCase();

        const managePeopleUrl = getManageAuthorisedPeopleFullUrl(companyNumber);
        deleteSearchStringEmail(req.session as Session, companyNumber);

        this.viewData.backLinkHref = this.viewData.cancelLinkHref = managePeopleUrl;

        if (method === constants.POST) {
            await postInvitation(req, companyNumber, association.userEmail);

            const authorisedPerson: AuthorisedPerson = {
                authorisedPersonEmailAddress: association.userEmail,
                authorisedPersonCompanyName: association.companyName
            };

            setExtraData(req.session, constants.AUTHORISED_PERSON, authorisedPerson);
        }

        return this.viewData;
    }
}
