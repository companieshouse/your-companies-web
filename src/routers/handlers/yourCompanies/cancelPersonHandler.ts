import { Request, Response } from "express";
import { GenericHandler } from "../genericHandler";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Cancellation } from "../../../types/cancellation";
import { ViewDataWithBackLink } from "../../../types/utilTypes";

/**
 * Interface representing the view data for the Cancel Person page.
 */
export interface CancelPersonViewData extends ViewDataWithBackLink {
    companyName: string;
    userEmail: string;
    buttonHref: string;
}

/**
 * Handler for managing the Cancel Person page functionality.
 */
export class CancelPersonHandler extends GenericHandler {
    viewData: CancelPersonViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = {
            templateName: constants.CANCEL_PERSON_PAGE,
            backLinkHref: "",
            lang: {},
            companyName: "",
            userEmail: "",
            buttonHref: ""
        };
    }

    /**
     * Executes the handler logic based on the HTTP method.
     *
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param method - The HTTP method (e.g., GET, POST).
     * @returns A promise resolving to the view data for the Cancel Person page.
     */
    async execute (req: Request, res: Response, method: string): Promise<CancelPersonViewData> {
        deleteExtraData(req.session, constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        setExtraData(req.session, constants.NAVIGATION_MIDDLEWARE_FLAG_FOR_COMPANY_AUTHENTICATION_SERVICE, true);
        this.populateViewData(req);

        const error = getExtraData(req.session, constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
        if (error) {
            this.viewData.errors = error;
        }

        if (method === constants.POST) {
            this.handlePostRequest(req);
        }

        return Promise.resolve(this.viewData);
    }

    /**
     * Populates the view data with information from the request and session.
     *
     * @param req - The HTTP request object.
     */
    private populateViewData (req: Request): void {
        this.viewData.lang = getTranslationsForView(req.lang, constants.CANCEL_PERSON_PAGE);
        this.viewData.backLinkHref = getExtraData(req.session, constants.REFERER_URL);
        this.viewData.companyName = getExtraData(req.session, constants.COMPANY_NAME);
        this.viewData.userEmail = req.params[constants.USER_EMAIL];
        this.viewData.buttonHref = req.originalUrl;
    }

    /**
     * Handles the logic for POST requests.
     *
     * @param req - The HTTP request object.
     */
    private handlePostRequest (req: Request): void {
        const payload = { ...req.body };

        if (!payload.cancelPerson) {
            this.viewData.errors = {
                cancelPerson: {
                    text: constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION
                }
            };
            setExtraData(req.session, constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION, this.viewData.errors);
        } else {
            deleteExtraData(req.session, constants.SELECT_YES_IF_YOU_WANT_TO_CANCEL_AUTHORISATION);
            this.viewData.errors = undefined;

            const cancellation: Cancellation = {
                cancelPerson: payload.cancelPerson,
                userEmail: req.params[constants.USER_EMAIL],
                companyNumber: getExtraData(req.session, constants.COMPANY_NUMBER)
            };

            setExtraData(req.session, constants.CANCEL_PERSON, cancellation);
        }
    }
}
