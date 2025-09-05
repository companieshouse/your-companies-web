import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { ViewDataWithBackLink } from "../../../types/utilTypes";
import { getFullUrl } from "../../../lib/utils/urlUtils";
import { setExtraData } from "../../../lib/utils/sessionUtils";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { isOrWasCompanyAssociatedWithUser, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import { AssociationState } from "../../../types/associations";

export interface RemoveAuthorisationDoNotRestoreViewData extends ViewDataWithBackLink {
    companyName: string;
    companyNumber: string;
    cancelLinkHref: string;
}

/**
 * Handles the logic for rendering the remove authorisation and do not restore page.
 */
export class RemoveAuthorisationDoNotRestoreHandler extends GenericHandler {
    viewData: RemoveAuthorisationDoNotRestoreViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE,
            lang: {},
            companyName: "",
            companyNumber: "",
            cancelLinkHref: "",
            backLinkHref: ""
        };
    }

    /**
     * Executes the handler logic to prepare the view data for the remove authorisation and do not restore page.
     *
     * @param req - The HTTP request object.
     * @returns A promise that resolves to the view data for the page.
     */
    async execute (req: Request, res: Response, method: string): Promise<RemoveAuthorisationDoNotRestoreViewData | void> {

        const companyNumber = req.params[constants.COMPANY_NUMBER];
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE);
        this.viewData.companyNumber = companyNumber;
        this.viewData.cancelLinkHref = constants.LANDING_URL;
        this.viewData.backLinkHref = constants.LANDING_URL;

        if (method === constants.GET) {
            return await this.handleGetRequest(req);
        } else if (method === constants.POST) {
            await this.handleCompanyRemoval(req, res);
        }
    }

    /**
     * Handles the GET request for the remove authorisation and do not restore page.
     *
     * @param req - The HTTP request object.
     * @returns The view data.
     */
    private async handleGetRequest (req: Request): Promise<RemoveAuthorisationDoNotRestoreViewData> {
        const companyProfile = await getCompanyProfile(this.viewData.companyNumber);
        setExtraData(req.session, constants.REMOVE_AUTHORISATION_COMPANY_NAME, companyProfile.companyName);
        this.viewData.companyName = companyProfile.companyName.toUpperCase();
        return this.viewData;
    }

    private async handleCompanyRemoval (req: Request, res: Response): Promise<RemoveAuthorisationDoNotRestoreViewData | void> {
        const companyNumber = req.params[constants.COMPANY_NUMBER];
        const associationState = await isOrWasCompanyAssociatedWithUser(req, companyNumber);

        if (associationState.state !== AssociationState.COMPANY_MIGRATED_NOT_YET_ASSOCIATED_WITH_USER &&
            associationState.state !== AssociationState.COMPANY_UNAUTHORISED_NOT_YET_ASSOCIATED_WITH_USER
        ) {
            throw new Error(`Cannot remove company ${companyNumber} as it is not associated with the user`);
        }

        const removalResult = await removeUserFromCompanyAssociations(req, associationState.associationId);

        if (removalResult !== constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS) {
            throw new Error(`Unexpected result when removing company ${companyNumber}: ${removalResult}`);
        }

        setExtraData(req.session, constants.REMOVE_AUTHORISATION_COMPANY_NUMBER, companyNumber);

        res.redirect(getFullUrl(constants.CONFIRMATION_AUTHORISATION_REMOVED_URL));
    }
}
