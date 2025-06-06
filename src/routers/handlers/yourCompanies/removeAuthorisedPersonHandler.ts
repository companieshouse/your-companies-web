import { Request } from "express";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { GenericHandler } from "../genericHandler";
import { deleteExtraData, getExtraData, setExtraData } from "../../../lib/utils/sessionUtils";
import { Removal } from "../../../types/removal";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";

/**
 * Interface representing the view data for the Remove Authorised Person page.
 */
export interface RemoveAuthorisedPersonViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    userEmail: string;
    userName: string;
    cancelLinkHref: string;
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
            cancelLinkHref: ""
        };
    }

    /**
     * Executes the handler logic based on the HTTP method.
     *
     * @param req - The HTTP request object.
     * @param method - The HTTP method (e.g., GET, POST).
     * @returns A promise resolving to the view data for the page.
     */
    async execute (req: Request, method: string): Promise<RemoveAuthorisedPersonViewData> {
        deleteExtraData(req.session, constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
        this.populateViewData(req);

        const error = getExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
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
        this.viewData.lang = getTranslationsForView(req.lang, constants.REMOVE_AUTHORISED_PERSON_PAGE);
        this.viewData.companyNumber = req.params[constants.COMPANY_NUMBER];
        this.viewData.cancelLinkHref = getExtraData(req.session, constants.REFERER_URL);
        this.viewData.backLinkHref = getExtraData(req.session, constants.REFERER_URL);
        this.viewData.companyName = getExtraData(req.session, constants.COMPANY_NAME);
        this.viewData.userEmail = req.params[constants.USER_EMAIL];
        this.viewData.userName = req.query[constants.USER_NAME] as string;
    }

    /**
     * Handles the logic for POST requests.
     *
     * @param req - The HTTP request object.
     */
    private handlePostRequest (req: Request): void {
        const payload = { ...req.body };

        if (!payload.confirmRemoval) {
            this.viewData.errors = { confirmRemoval: { text: constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ } };
            setExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ, this.viewData.errors);
        } else {
            deleteExtraData(req.session, constants.SELECT_IF_YOU_CONFIRM_THAT_YOU_HAVE_READ);
            this.viewData.errors = undefined;

            const removal: Removal = {
                removePerson: payload.confirmRemoval,
                userEmail: req.params[constants.USER_EMAIL],
                userName: req.query[constants.USER_NAME] ? req.query[constants.USER_NAME] as string : undefined,
                companyNumber: getExtraData(req.session, constants.COMPANY_NUMBER)
            };

            setExtraData(req.session, constants.REMOVE_PERSON, removal);
        }
    }
}
