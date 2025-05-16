import { Request, Response } from "express";
import { GenericHandler } from "../../handlers/genericHandler";
import { getTranslationsForView } from "../../../lib/utils/translations";
import * as constants from "../../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import logger, { createLogMessage } from "../../../lib/Logger";
import { isOrWasCompanyAssociatedWithUser, removeUserFromCompanyAssociations } from "../../../services/associationsService";
import { getCompanyProfile } from "../../../services/companyProfileService";
import { AssociationState } from "../../../types/associations";
import { getFullUrl } from "../../../lib/utils/urlUtils";

interface RemoveCompanyViewData extends ViewDataWithBackLink, CompanyNameAndNumber { }

/**
 * Handles the removal of a company associated with a user.
 */
export class RemoveCompanyHandler extends GenericHandler {
    viewData: RemoveCompanyViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.REMOVE_COMPANY_PAGE,
            backLinkHref: constants.LANDING_URL,
            lang: {},
            companyName: "",
            companyNumber: ""
        };
    }

    /**
     * Executes the handler logic based on the HTTP method.
     *
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param method - The HTTP method (GET or POST).
     * @returns The view data or void.
     */
    async execute (req: Request, res: Response, method: string): Promise<RemoveCompanyViewData | void> {
        const companyNumber = req.params[constants.COMPANY_NUMBER];
        this.viewData.companyNumber = companyNumber;
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_COMPANY_PAGE);

        if (method === constants.GET) {
            return this.handleGetRequest(req);
        } else if (method === constants.POST) {
            return this.handlePostRequest(req, res);
        }
    }

    /**
     * Handles the GET request for the remove company page.
     *
     * @param req - The HTTP request object.
     * @returns The view data.
     */
    private async handleGetRequest (req: Request): Promise<RemoveCompanyViewData> {
        const error = getExtraData(req.session, constants.YOU_MUST_SELECT_AN_OPTION);

        try {
            const companyProfile = await getCompanyProfile(this.viewData.companyNumber);
            setExtraData(req.session, constants.COMPANY_NAME, companyProfile.companyName);
            this.viewData.companyName = companyProfile.companyName;
        } catch (err) {
            logger.error(createLogMessage(req.session, `${RemoveCompanyHandler.name}.${this.handleGetRequest.name}`, `Error fetching company profile for ${this.viewData.companyNumber}: ${err}`));
        }

        if (error) {
            this.viewData.errors = {
                confirmRemoval: {
                    text: "you_must_select_an_option"
                }
            };
        }

        return this.viewData;
    }

    /**
     * Handles the POST request for the remove company page.
     *
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns The view data or void.
     */
    private async handlePostRequest (req: Request, res: Response): Promise<RemoveCompanyViewData | void> {
        this.viewData.companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const selectedOption = req.body.confirmRemoval;

        if (!selectedOption) {
            this.viewData.errors = {
                confirmRemoval: {
                    text: "you_must_select_an_option"
                }
            };
            setExtraData(req.session, constants.YOU_MUST_SELECT_AN_OPTION, this.viewData.errors);
            return this.viewData;
        }

        deleteExtraData(req.session, constants.YOU_MUST_SELECT_AN_OPTION);

        if (selectedOption === "yes") {
            return this.handleCompanyRemoval(req, res);
        } else if (selectedOption === "no") {
            res.redirect(constants.LANDING_URL);
        }
    }

    /**
     * Handles the removal of a company from the user's associations.
     *
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns The view data or void.
     */
    private async handleCompanyRemoval (req: Request, res: Response): Promise<RemoveCompanyViewData | void> {
        const companyNumber = req.params[constants.COMPANY_NUMBER];
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);

        const associationState = await isOrWasCompanyAssociatedWithUser(req, companyNumber);

        if (associationState.state !== AssociationState.COMPANY_ASSOCIATED_WITH_USER) {
            return this.renderErrorPage(res, `Cannot remove company ${companyNumber} as it is not associated with the user`);
        }

        const removalResult = await removeUserFromCompanyAssociations(req, associationState.associationId);

        if (removalResult !== constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS) {
            return this.renderErrorPage(res, `Unexpected result when removing company ${companyNumber}: ${removalResult}`);
        }

        setExtraData(req.session, constants.COMPANY_STATUS_INACTIVE, true);
        setExtraData(req.session, constants.LAST_REMOVED_COMPANY_NAME, companyName);
        setExtraData(req.session, constants.LAST_REMOVED_COMPANY_NUMBER, companyNumber);

        res.redirect(getFullUrl(constants.REMOVE_COMPANY_CONFIRMED_URL));
    }

    /**
     * Renders an error page with the provided error message.
     *
     * @param res - The HTTP response object.
     * @param errorMessage - The error message to log and display.
     * @returns The view data.
     */
    private renderErrorPage (res: Response, errorMessage: string): RemoveCompanyViewData {
        logger.error(errorMessage);
        this.viewData.errors = {
            generic: {
                text: "error_removing_company"
            }
        };
        return this.viewData;
    }
}
