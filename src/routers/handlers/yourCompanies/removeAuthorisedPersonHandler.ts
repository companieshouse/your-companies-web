import { Request, Response } from "express";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { GenericHandler } from "../genericHandler";
import { deleteExtraData, getExtraData, getLoggedInUserId, setExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import { Session } from "@companieshouse/node-session-handler";
import {
    Association,
    AssociationStatus
} from "@companieshouse/api-sdk-node/dist/services/associations/types";

import { getFullUrl, getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";
import { getAssociationById, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import logger, { createLogMessage } from "../../../lib/Logger";
import { PersonRemovedConfirmation, Removal } from "../../../types/removal";

/**
 * Interface representing the view data for the Remove Authorised Person page.
 */
export interface RemoveAuthorisedPersonViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    userEmail: string;
    userName: string;
    cancelLinkHref: string;
    currentStatus: string;
}

/**
 * Handler for removing an authorised person from a company.
 */
export class RemoveAuthorisedPersonHandler extends GenericHandler {
    viewData: RemoveAuthorisedPersonViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVE_AUTHORISED_PERSON_PAGE,
            backLinkHref: "",
            lang: {},
            companyName: "",
            companyNumber: "",
            userEmail: "",
            userName: "",
            cancelLinkHref: "",
            currentStatus: ""
        };
    }

    /**
     * Executes the handler logic based on the HTTP method.
     *
     * @param req - The HTTP request object.
     * @param method - The HTTP method (e.g., GET, POST).
     * @returns A promise resolving to the view data for the page.
     */
    async execute (req: Request): Promise<RemoveAuthorisedPersonViewData> {
        await this.populateViewData(req);
        return this.viewData;
    }

    /**
     * Populates the view data with information from the request and session.
     *
     * @param req - The HTTP request object.
     */
    private async populateViewData (req: Request): Promise<void> {

        const associationId = req.params[constants.ASSOCIATIONS_ID];
        let association: Association;

        association = getExtraData(req.session, this.getSessionKey(req));
        let fetched = false;
        if (!association) {
            association = await getAssociationById(req, associationId);
            fetched = true;
        }

        if (!association) {
            throw new Error("Association to be removed not fetched from session or API");
        }

        if (association.companyNumber !== req.params[constants.COMPANY_NUMBER]) {
            throw new Error("Company number in association does not match the company number in the url");
        }

        if (![AssociationStatus.AWAITING_APPROVAL, AssociationStatus.CONFIRMED, AssociationStatus.MIGRATED].includes(association.status)) {
            throw new Error("Invalid association status");
        }

        if (fetched) {
            setExtraData(req.session, this.getSessionKey(req), association);
        }
        this.viewData.currentStatus = association.status;
        this.viewData.companyNumber = association.companyNumber;
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_AUTHORISED_PERSON_PAGE);
        this.viewData.cancelLinkHref = getManageAuthorisedPeopleFullUrl(this.viewData.companyNumber);
        this.viewData.backLinkHref = getManageAuthorisedPeopleFullUrl(this.viewData.companyNumber);
        this.viewData.companyName = association.companyName;
        this.viewData.userName = this.getNameOrEmail(association.displayName, association.userEmail);
        this.viewData.userEmail = association.userEmail;
        this.viewData.templateName = this.getTemplateViewName();

        const error = getExtraData(req.session, constants.REMOVE_PAGE_ERRORS);

        if (error) {
            this.viewData.errors = error;
        }
    }

    public async handlePostRequest (req: Request, res: Response): Promise<void> {
        if (req.body.confirmRemoval === constants.CONFIRM) {
            const associationToBeRemoved = this.getAndValidateAssociation(req);
            await this.processAssociationRemoval(req, res, associationToBeRemoved);
        } else if (req.body.confirmRemoval === constants.NO) {
            deleteExtraData(req.session, this.getSessionKey(req));
            logger.info(createLogMessage(req.session, this.handlePostRequest.name, "User chose not to confirm removal"));
            return res.redirect(getManageAuthorisedPeopleFullUrl(req.params[constants.COMPANY_NUMBER]));
        } else {
            return await this.handleUnconfirmedRemoval(req, res);
        }
    }

    private async handleUnconfirmedRemoval (req: Request, res: Response): Promise<void> {
        await this.populateViewData(req);
        if (this.viewData.currentStatus === AssociationStatus.AWAITING_APPROVAL) {
            this.viewData.errors = { cancelPerson: { text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION } };
            setExtraData(req.session, constants.REMOVE_PAGE_ERRORS, this.viewData.errors);
        } else if (this.viewData.currentStatus === AssociationStatus.MIGRATED) {
            this.viewData.errors = { confirmRemoval: { text: constants.CONFIRM_YOU_HAVE_READ } };
            setExtraData(req.session, constants.REMOVE_PAGE_ERRORS, this.viewData.errors);
        } else {
            this.viewData.errors = { confirmRemoval: { text: constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ } };
            setExtraData(req.session, constants.REMOVE_PAGE_ERRORS, this.viewData.errors);
        }

        logger.info(createLogMessage(req.session, this.handleUnconfirmedRemoval.name, "Rendering with validation errors"));

        return res.render(this.getTemplateViewName(), this.viewData);
    }

    private getAndValidateAssociation (req: Request): Association {
        const association = getExtraData(req.session, this.getSessionKey(req));
        if (!association) {
            throw new Error("Association to be removed not found in session");
        }
        if (association.companyNumber !== req.params[constants.COMPANY_NUMBER]) {
            throw new Error("Company number in association does not match the company number in the url");
        }
        return association;
    }

    private async processAssociationRemoval (req: Request, res: Response, association: Association): Promise<void> {
        deleteExtraData(req.session, constants.REMOVE_PAGE_ERRORS);
        deleteExtraData(req.session, this.getSessionKey(req));

        logger.info(createLogMessage(req.session, this.processAssociationRemoval.name,
            `Removing association id: ${association.id}, company number: ${association.companyNumber}`));

        await removeUserFromCompanyAssociations(req, association.id);

        if (this.hasRemovedThemselves(req.session as Session, association.userId)) {
            await this.handleSelfRemoval(req, res, association);
        } else {
            await this.handleOtherUserRemoval(req, res, association);
        }
    }

    private async handleSelfRemoval (req: Request, res: Response, association: Association): Promise<void> {
        logger.info(createLogMessage(req.session, this.handleSelfRemoval.name,
            `Self-removal from ${association.companyNumber}`));

        setExtraData(req.session, constants.REMOVED_THEMSELVES_FROM_COMPANY, {
            companyName: association.companyName,
            companyNumber: association.companyNumber
        } as CompanyNameAndNumber);

        res.redirect(getFullUrl(constants.REMOVED_THEMSELVES_URL));
    }

    private async handleOtherUserRemoval (req: Request, res: Response, association: Association): Promise<void> {
        const userNameOrEmail = this.getNameOrEmail(association.displayName, association.userEmail);
        const removal: Removal = {
            userEmail: association.userEmail,
            userName: userNameOrEmail,
            companyNumber: req.params[constants.COMPANY_NUMBER],
            status: association.status
        };

        const personRemovedConfirmationData: PersonRemovedConfirmation = {
            userNameOrEmail,
            companyNumber: req.params[constants.COMPANY_NUMBER],
            companyName: association.companyName
        };

        setExtraData(req.session, constants.REMOVE_PERSON, removal);
        setExtraData(req.session, constants.PERSON_REMOVED_CONFIRMATION_DATA, personRemovedConfirmationData);
        logger.info(createLogMessage(req.session, this.handleOtherUserRemoval.name,
            `Association ${association.id} removed`));

        const redirectUrl = this.getRedirectUrl(association.status);
        res.redirect(redirectUrl);
    }

    private getRedirectUrl (status: AssociationStatus): string {
        switch (status) {
        case AssociationStatus.AWAITING_APPROVAL:
            return getFullUrl(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_CANCELLED_URL);
        case AssociationStatus.MIGRATED:
            return getFullUrl(constants.CONFIRMATION_PERSONS_DIGITAL_AUTHORISATION_REMOVED_NOT_RESTORED_URL);
        case AssociationStatus.CONFIRMED:
            return getFullUrl(constants.CONFIRMATION_PERSON_REMOVED_URL);
        default:
            throw new Error("Unexpected association status");
        }
    }

    private getSessionKey (req: Request): string {
        return `associationForRemoval:id:${req.params[constants.ASSOCIATIONS_ID]}:companyNumber:${req.params[constants.COMPANY_NUMBER]}`;
    }

    private hasRemovedThemselves (session: Session, associationId: string): boolean {
        return getLoggedInUserId(session) === associationId;
    }

    public getNameOrEmail (displayName: string | undefined, userEmail: string): string {
        return (!displayName || displayName === constants.NOT_PROVIDED) ? userEmail : displayName;
    }

    public getTemplateViewName (): string {
        switch (this.viewData.currentStatus) {
        case AssociationStatus.MIGRATED:
            return constants.REMOVE_DO_NOT_RESTORE_PAGE;
        case AssociationStatus.CONFIRMED:
            return constants.REMOVE_AUTHORISED_PERSON_PAGE;
        case AssociationStatus.AWAITING_APPROVAL:
            return constants.CANCEL_PERSON_PAGE;
        default:
            throw new Error("Unexpected association status");
        }
    }
}
