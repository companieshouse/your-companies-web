import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/util-types";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getFullUrl, getUrlWithCompanyNumber } from "../../../lib/utils/urlUtils";

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
            landingPageUrl: getFullUrl(constants.LANDING_URL),
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
        this.viewData.backLinkHref = getUrlWithCompanyNumber(getFullUrl(constants.CHECK_PRESENTER_URL), companyNumber);

        return Promise.resolve(this.viewData);
    }
}
