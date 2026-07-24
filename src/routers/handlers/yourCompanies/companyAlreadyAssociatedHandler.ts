import { Request } from "express";
import { GenericHandler } from "../genericHandler";
import { CompanyNameAndNumber, ViewDataWithBackLink } from "../../../types/utilTypes";
import * as constants from "../../../constants";
import { getTranslationsForView } from "../../../lib/utils/translations";
import { getExtraData } from "../../../lib/utils/sessionUtils";
import { getFullUrl } from "../../../lib/utils/urlUtils";

interface CompanyAlreadyAssociatedViewData extends ViewDataWithBackLink, CompanyNameAndNumber {
    landingPageUrl: string;
    addCompanyUrl: string;
    reason: string;
}

export class CompanyAlreadyAssociatedHandler extends GenericHandler {
    declare viewData: CompanyAlreadyAssociatedViewData;

    async execute(req: Request): Promise<CompanyAlreadyAssociatedViewData> {
        this.viewData.lang = getTranslationsForView(req.lang, constants.COMPANY_ALREADY_ASSOCIATED_STOP_SCREEN_PAGE);
        this.viewData.companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
        this.viewData.companyName = getExtraData(req.session, constants.COMPANY_NAME);
        this.viewData.reason = getExtraData(req.session, constants.COMPANY_ALREADY_ASSOCIATED_REASON);
        this.viewData.backLinkHref = constants.LANDING_URL;
        this.viewData.landingPageUrl = constants.LANDING_URL;
        this.viewData.addCompanyUrl = getFullUrl(constants.ADD_COMPANY_URL);
        return Promise.resolve(this.viewData);
    }
}