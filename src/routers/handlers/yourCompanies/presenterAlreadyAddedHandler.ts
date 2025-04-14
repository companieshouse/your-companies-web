import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getCheckPresenterFullUrl } from "../../../lib/utils/urlUtils";

/**
 * Interface representing the view data for the Presenter Already Added page.
 */
interface PresenterAlreadyAddedViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    emailAddress: string;
    landingPageUrl: string;
}

/**
 * Handler for the Presenter Already Added page.
 * This handler prepares the view data required to render the page.
 */
export class PresenterAlreadyAddedHandler extends GenericHandler {
    viewData: PresenterAlreadyAddedViewData;

    /**
     * Initializes the handler with default view data.
     */
    constructor () {
        super();
        this.viewData = this.initializeViewData();
    }

    /**
     * Executes the handler logic to populate the view data.
     *
     * @param req - The HTTP request object.
     * @returns A promise resolving to the populated view data.
     */
    async execute (req: Request): Promise<PresenterAlreadyAddedViewData> {
        this.viewData.lang = getTranslationsForView(req.lang, constants.PRESENTER_ALREADY_ADDED_PAGE);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        this.viewData.companyNumber = companyNumber;
        this.viewData.companyName = getExtraData(req.session, constants.COMPANY_NAME);
        this.viewData.emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        this.viewData.backLinkHref = getCheckPresenterFullUrl(companyNumber);

        return Promise.resolve(this.viewData);
    }

    /**
     * Initializes the default view data for the handler.
     *
     * @returns The default view data object.
     */
    private initializeViewData (): PresenterAlreadyAddedViewData {
        return {
            templateName: constants.PRESENTER_ALREADY_ADDED_PAGE,
            landingPageUrl: constants.LANDING_URL,
            lang: {},
            companyName: "",
            companyNumber: "",
            emailAddress: "",
            backLinkHref: ""
        };
    }
}
