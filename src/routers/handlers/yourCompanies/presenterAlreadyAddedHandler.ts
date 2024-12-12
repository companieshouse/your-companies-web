import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getCheckPresenterFullUrl } from "../../../lib/utils/urlUtils";

interface PresenterAlreadyAddedViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    emailAddress: string;
    landingPageUrl: string;
}

export class PresenterAlreadyAddedHandler extends GenericHandler {
    viewData: PresenterAlreadyAddedViewData;

    constructor () {
        super();
        this.viewData = {
            templateName: constants.PRESENTER_ALREADY_ADDED_PAGE,
            landingPageUrl: constants.LANDING_URL,
            lang: {},
            companyName: "",
            companyNumber: "",
            emailAddress: "",
            backLinkHref: ""
        };
    }

    async execute (req: Request): Promise<PresenterAlreadyAddedViewData> {
        this.viewData.lang = getTranslationsForView(req.lang, constants.PRESENTER_ALREADY_ADDED_PAGE);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        this.viewData.companyNumber = companyNumber;
        this.viewData.companyName = getExtraData(req.session, constants.COMPANY_NAME);
        this.viewData.emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        this.viewData.backLinkHref = getCheckPresenterFullUrl(companyNumber);

        return Promise.resolve(this.viewData);
    }
}
