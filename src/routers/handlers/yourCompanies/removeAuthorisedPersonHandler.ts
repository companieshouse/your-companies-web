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
} from "private-api-sdk-node/dist/services/associations/types";

import { getFullUrl, getManageAuthorisedPeopleFullUrl } from "../../../lib/utils/urlUtils";
import { getAssociationById, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import logger, { createLogMessage } from "../../../lib/Logger";

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
        deleteExtraData(req.session, constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);

        await this.populateViewData(req);
        return Promise.resolve(this.viewData);

    }

    /**
     * Populates the view data with information from the request and session.
     *
     * @param req - The HTTP request object.
     */
    private async populateViewData (req: Request): Promise<void> {

        const associationId = req.params[constants.ASSOCIATIONS_ID];

        const association = await getAssociationById(req, associationId);
        if (association.companyNumber !== req.params[constants.COMPANY_NUMBER]) {
            throw new Error("Company number in association does not match the company number in the url");
        }

        console.log("association to be removed is ", association);

        setExtraData(req.session, this.getSessionKey(req), association);

        const error = getExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
        if (error) {
            this.viewData.errors = error;
        }
        this.viewData.currentStatus = association.status;
        this.viewData.companyNumber = association.companyNumber;
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_AUTHORISED_PERSON_PAGE);
        this.viewData.cancelLinkHref = getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, this.viewData.companyNumber);
        this.viewData.backLinkHref = getManageAuthorisedPeopleFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL, this.viewData.companyNumber);
        this.viewData.companyName = association.companyName;
        this.viewData.userName = this.getNameOrEmail(association.displayName, association.userEmail);
        this.viewData.userEmail = association.userEmail;
        this.viewData.templateName = this.getTemplateViewName();
    }

    public async handlePostRequest (req: Request, res: Response): Promise<void> {

        console.log(req.body);
        if (req.body.confirmRemoval === "confirm") {
            const associationToBeRemoved = this.getAndValidateAssociation(req);
            await this.processAssociationRemoval(req, res, associationToBeRemoved);
        } else if (req.body.confirmRemoval === "no") {
            res.redirect(getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_URL)
                .replace(`:${constants.COMPANY_NUMBER}`, req.params[constants.COMPANY_NUMBER]));
            deleteExtraData(req.session, this.getSessionKey(req));
            logger.info(createLogMessage(req.session, "handlePostRequest", "User chose not to confirm removal"));
        } else {
            return await this.handleUnconfirmedRemoval(req, res);
        }
    }

    private async handleUnconfirmedRemoval (req: Request, res: Response): Promise<void> {
        await this.populateViewData(req);
        if (this.viewData.currentStatus === AssociationStatus.AWAITING_APPROVAL) {
            this.viewData.errors = { cancelPerson: { text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION } };
            setExtraData(req.session, constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION, this.viewData.errors);
        } else {
            this.viewData.errors = { confirmRemoval: { text: constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ } };
            setExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ, this.viewData.errors);
        }

        logger.info(createLogMessage(req.session, "handleUnconfirmedRemoval", "Rendering with validation errors"));

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
        deleteExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
        this.viewData.errors = undefined;

        logger.info(createLogMessage(req.session, "processAssociationRemoval",
            `Removing association ${association.id}, ${association.companyNumber}`));

        await removeUserFromCompanyAssociations(req, association.id);

        if (this.hasRemovedThemselves(req.session as Session, association.userId)) {
            await this.handleSelfRemoval(req, res, association);
        } else {
            await this.handleOtherUserRemoval(req, res, association);
        }
    }

    private async handleSelfRemoval (req: Request, res: Response, association: Association): Promise<void> {
        logger.info(createLogMessage(req.session, "handleSelfRemoval",
            `Self-removal from ${association.companyNumber}`));

        setExtraData(req.session, constants.REMOVED_THEMSELVES_FROM_COMPANY, {
            companyName: association.companyName,
            companyNumber: association.companyNumber
        } as CompanyNameAndNumber);

        res.redirect(getFullUrl(constants.REMOVED_THEMSELVES_URL));
    }

    private async handleOtherUserRemoval (req: Request, res: Response, association: Association): Promise<void> {
        const removal = {
            userEmail: association.userEmail,
            userName: this.getNameOrEmail(association.displayName, association.userEmail),
            companyNumber: req.params[constants.COMPANY_NUMBER],
            status: association.status
        };

        setExtraData(req.session, constants.REMOVE_PERSON, removal);
        logger.info(createLogMessage(req.session, "handleOtherUserRemoval",
            `Association ${association.id} removed`));

        const redirectUrl = getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL)
            .replace(`:${constants.COMPANY_NUMBER}`, association.companyNumber);
        res.redirect(redirectUrl);
    }

    private getSessionKey (req:Request): string {
        return `associationForRemoval:id:${req.params[constants.ASSOCIATIONS_ID]}:companyNumber:${req.params[constants.COMPANY_NUMBER]}`;
    }

    private hasRemovedThemselves (session:Session, associationId: string): boolean {
        return getLoggedInUserId(session) === associationId;
    }

    public getNameOrEmail (displayName: string | undefined, userEmail: string): string {
        return (!displayName || displayName === constants.NOT_PROVIDED) ? userEmail : displayName;
    }

    public getTemplateViewName ():string {
        // const association:Association = getExtraData(req.session, this.getSessionKey(req));
        if (this.viewData.currentStatus === AssociationStatus.MIGRATED) {
            return "remove-do-not-restore";
        } else if (this.viewData.currentStatus === AssociationStatus.CONFIRMED) {
            return "remove-authorised-person";
        } else if (this.viewData.currentStatus === AssociationStatus.AWAITING_APPROVAL) {
            return "cancel-person";
        } else {
            throw Error("unexpected status");
        }
    }
}
