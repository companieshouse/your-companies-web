import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { BaseViewData } from "../../../types/utilTypes";
import { updateAssociationStatus } from "../../../services/associationsService";
import { AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getCompanyInvitationsAcceptFullUrl } from "../../../lib/utils/urlUtils";

/**
 * Interface representing the view data for the Company Invitations Accept page.
 */
interface CompanyInvitationsAcceptViewData extends BaseViewData {
    yourCompaniesUrl: string;
    companyName: string;
    associationStateChanged: string | undefined;
}

/**
 * Handler for processing company invitation acceptance requests.
 */
export class CompanyInvitationsAcceptHandler extends GenericHandler {
    viewData: CompanyInvitationsAcceptViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.COMPANY_INVITATIONS_ACCEPT_PAGE,
            yourCompaniesUrl: constants.LANDING_URL,
            lang: {},
            associationStateChanged: undefined,
            companyName: ""
        };
    }

    /**
     * Executes the handler logic for accepting a company invitation.
     *
     * @param req - The HTTP request object.
     * @returns A promise resolving to the view data for the page.
     */
    async execute (req: Request): Promise<CompanyInvitationsAcceptViewData> {
        const associationId = req.params[constants.ASSOCIATIONS_ID];
        const associationStateChanged = this.isAssociationStateChanged(req, associationId);
        const referrer = req.get("Referrer");
        const companyName = req.query[constants.COMPANY_NAME] as string;
        const expectedReferrer = this.getExpectedReferrer(associationId, companyName);

        this.viewData.companyName = companyName;

        if (!associationStateChanged) {
            await this.confirmAssociation(req, associationId);
        } else if (!this.isValidReferrer(referrer, expectedReferrer)) {
            this.viewData.associationStateChanged = constants.ASSOCIATION_STATE_CHANGED_FOR + associationId;
        } else {
            this.viewData.lang = getTranslationsForView(req.lang, constants.COMPANY_INVITATIONS_ACCEPT_PAGE);
        }

        return Promise.resolve(this.viewData);
    }

    /**
     * Checks if the association state has already been changed.
     *
     * @param req - The HTTP request object.
     * @param associationId - The ID of the association.
     * @returns A boolean indicating whether the association state has changed.
     */
    private isAssociationStateChanged (req: Request, associationId: string): boolean {
        return getExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId) === constants.TRUE;
    }

    /**
     * Confirms the association by updating its status and setting session data.
     *
     * @param req - The HTTP request object.
     * @param associationId - The ID of the association.
     */
    private async confirmAssociation (req: Request, associationId: string): Promise<void> {
        await updateAssociationStatus(req, associationId, AssociationStatus.CONFIRMED);
        setExtraData(req.session, constants.ASSOCIATION_STATE_CHANGED_FOR + associationId, constants.TRUE);
        this.viewData.lang = getTranslationsForView(req.lang, constants.COMPANY_INVITATIONS_ACCEPT_PAGE);
    }

    /**
     * Constructs the expected referrer URL for validation.
     *
     * @param associationId - The ID of the association.
     * @param companyName - The name of the company.
     * @returns The expected referrer URL.
     */
    private getExpectedReferrer (associationId: string, companyName: string): string {
        return `${getCompanyInvitationsAcceptFullUrl(associationId)}?${constants.COMPANY_NAME}=${encodeURIComponent(companyName.replace(/ /g, "+"))}`;
    }

    /**
     * Validates the referrer URL.
     *
     * @param referrer - The referrer URL from the request.
     * @param expectedReferrer - The expected referrer URL.
     * @returns A boolean indicating whether the referrer is valid.
     */
    private isValidReferrer (referrer: string | undefined, expectedReferrer: string): boolean {
        return referrer?.includes(expectedReferrer) ?? false;
    }
}
