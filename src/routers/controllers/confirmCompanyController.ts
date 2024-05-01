import { Request, Response } from "express";
import { ConfirmCorrectCompanyHandler } from "../handlers/yourCompanies/confirmCorrectCompanyHandler";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import * as urlUtils from "../../lib/utils/urlUtils";
import { CompanyNameAndNumber } from "../../types/util-types";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const confirmCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {

    const referrer: string | undefined = req.get("Referrer");
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const companyProfile = getExtraData(req.session, constants.COMPANY_PROFILE);

    if (redirectPage(referrer, constants.ADD_COMPANY_URL, constants.CONFIRM_COMPANY_DETAILS_URL, pageIndicator, constants.COMPANY_ADDED_SUCCESS_URL)) {
        res.redirect(constants.LANDING_URL);
    } else {
        const confirmCompanyDetailsIndicator = true;
        setExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR, confirmCompanyDetailsIndicator);
        const viewData = await new ConfirmCorrectCompanyHandler().execute(req.t, companyProfile, req.language);
        res.render(constants.CONFIRM_COMPANY_PAGE, viewData);
    }
};

export const confirmCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const company = getExtraData(req.session, constants.COMPANY_PROFILE);

    const confirmedCompanyForAssocation: CompanyNameAndNumber = {
        companyNumber: company.companyNumber,
        companyName: company.companyName
    };
    setExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
    const nextPageUrl = urlUtils.getUrlWithCompanyNumber(constants.CREATE_COMPANY_ASSOCIATION_PATH_FULL, company.companyNumber);

    return res.redirect(nextPageUrl);

};
