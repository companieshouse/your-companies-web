import { Request } from "express";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { GenericHandler } from "../genericHandler";
import { AnyRecord, BaseViewData } from "../../../types/utilTypes";
import { updateAssociationStatus } from "../../../services/associationsService";
import { AssociationStatus } from "@companieshouse/api-sdk-node/dist/services/associations/types";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getCompanyInvitationsDeclineFullUrl } from "../../../lib/utils/urlUtils";

/**
 * Interface representing the view data for the Company Invitations Decline page.
 */
interface CompanyInvitationsDeclineViewData extends BaseViewData {
    buttonLinkHref: string;
    companyName: string;
    associationStateChanged: string | undefined;
}

/**
 * Handler for managing the decline of company invitations.
 */
export class CompanyInvitationsDeclineHandler extends GenericHandler {
    viewData: CompanyInvitationsDeclineViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.COMPANY_INVITATIONS_DECLINE_PAGE,
            buttonLinkHref: constants.LANDING_URL,
            lang: {},
            associationStateChanged: undefined,
            companyName: ""
        };
    }

    /**
     * Executes the handler logic for declining a company invitation.
     *
     * @param req - The HTTP request object.
     * @returns A promise resolving to the view data for the page.
     */
    async execute (req: Request): Promise<CompanyInvitationsDeclineViewData> {
        const associationId = req.params[constants.ASSOCIATIONS_ID];
        const associationStateChanged = this.isAssociationStateChanged(req, associationId);
        const referrer = req.get("Referrer");
        const companyName = this.getCompanyName(req);
        const expectedReferrer = getCompanyInvitationsDeclineFullUrl(associationId);

        this.viewData.companyName = companyName;

        if (!associationStateChanged) {
            await this.handleAssociationStatusUpdate(req, associationId);
        } else if (!this.isReferrerValid(referrer, expectedReferrer)) {
            this.viewData.associationStateChanged = constants.ASSOCIATION_STATE_CHANGED_FOR + associationId;
        } else {
            this.viewData.lang = this.getTranslations(req);
        }

        return Promise.resolve(this.viewData);
    }

    /**
     * Checks if the association state has already been changed.
     *
     * @param req - The HTTP request object.
     * @param associationId - The ID of the association.
     * @returns A boolean indicating whether the state has changed.
     */
    private isAssociationStateChanged (req: Request, associationId: string): boolean {
        return getExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId) === constants.TRUE;
    }

    /**
     * Retrieves the company name from the request query.
     *
     * @param req - The HTTP request object.
     * @returns The company name.
     */
    private getCompanyName (req: Request): string {
        return req.query[constants.COMPANY_NAME] as string;
    }

    /**
     * Updates the association status and sets the session data.
     *
     * @param req - The HTTP request object.
     * @param associationId - The ID of the association.
     */
    private async handleAssociationStatusUpdate (req: Request, associationId: string): Promise<void> {
        await updateAssociationStatus(req, associationId, AssociationStatus.REMOVED);
        setExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId, constants.TRUE);
        this.viewData.lang = this.getTranslations(req);
    }

    /**
     * Validates the referrer URL.
     *
     * @param referrer - The referrer URL from the request.
     * @param expectedReferrer - The expected referrer URL.
     * @returns A boolean indicating whether the referrer is valid.
     */
    private isReferrerValid (referrer: string | undefined, expectedReferrer: string): boolean {
        return referrer?.includes(expectedReferrer) ?? false;
    }

    /**
     * Retrieves the translations for the view.
     *
     * @param req - The HTTP request object.
     * @returns The translations for the view.
     */
    private getTranslations (req: Request): AnyRecord {
        return getTranslationsForView(req.lang, constants.COMPANY_INVITATIONS_DECLINE_PAGE);
    }
}
