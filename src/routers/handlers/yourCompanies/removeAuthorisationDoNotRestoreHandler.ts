import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { BaseViewData } from "../../../types/utilTypes";
import { getConfirmationAuthorisationRemovedFullUrl } from "../../../lib/utils/urlUtils";
import { getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { getCompanyProfile } from "../../../services/companyProfileService";
import logger, { createLogMessage } from "../../../lib/Logger";

interface RemoveAuthorisationDoNotRestoreViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    cancelLinkHref: string;
    removeLinkHref: string
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
            removeLinkHref: ""
        };
    }

    /**
     * Executes the handler logic to prepare the view data for the remove authorisation and do not restore page.
     *
     * @param req - The HTTP request object.
     * @returns A promise that resolves to the view data for the page.
     */
    async execute (req: Request, res: Response, method: string): Promise<RemoveAuthorisationDoNotRestoreViewData> {

        const companyNumber = req.params[constants.COMPANY_NUMBER] as string;
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_AUTHORISATION_DO_NOT_RESTORE_PAGE);
        this.viewData.companyNumber = companyNumber;
        this.viewData.cancelLinkHref = constants.MANAGE_AUTHORISED_PEOPLE_URL;
        this.viewData.removeLinkHref = getConfirmationAuthorisationRemovedFullUrl(companyNumber);

        if (method === constants.GET) {
            return this.handleGetRequest(req);
            // } else if (method === constants.POST) {
            //     // return this.handlePostRequest(req, res);
            //     return undefined;
            // }
        }
        return Promise.resolve(this.viewData);
    }

    /**
     * Handles the GET request for the remove authorisation and do not restore page.
     *
     * @param req - The HTTP request object.
     * @returns The view data.
     */
    private async handleGetRequest (req: Request): Promise<RemoveAuthorisationDoNotRestoreViewData> {
        try {
            const companyProfile = await getCompanyProfile(this.viewData.companyNumber);
            setExtraData(req.session, constants.COMPANY_NAME, companyProfile.companyName);
            this.viewData.companyName = companyProfile.companyName;
        } catch (err) {
            logger.error(createLogMessage(req.session, `${RemoveAuthorisationDoNotRestoreHandler.name}.${this.handleGetRequest.name}`, `Error fetching company profile for ${this.viewData.companyNumber}: ${err}`));
        }
        return this.viewData;
    }
}
