import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { ViewData } from "../../../types/util-types";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getUrlWithCompanyNumber } from "../../../lib/utils/urlUtils";

export class PresenterAlreadyAddedHandler extends GenericHandler {

    async execute (req: Request): Promise<ViewData> {

        this.viewData = await this.getViewData(req);
        return Promise.resolve(this.viewData);
    }

    private async getViewData (req: Request): Promise<ViewData> {
        const translations = getTranslationsForView(req.t, constants.PRESENTER_ALREADY_ADDED_PAGE);
        const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        const companyName = getExtraData(req.session, constants.COMPANY_NAME);
        const emailAddress = getExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL);
        const backLinkHref = getUrlWithCompanyNumber(constants.YOUR_COMPANIES_CHECK_PRESENTER_URL, companyNumber);
        return {
            lang: translations,
            companyNumber,
            companyName,
            emailAddress,
            backLinkHref,
            landingPageUrl: constants.LANDING_URL
        };
    }
}
