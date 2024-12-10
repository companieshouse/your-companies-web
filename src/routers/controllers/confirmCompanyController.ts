import { Request, Response } from "express";
import { ConfirmCorrectCompanyHandler } from "../handlers/yourCompanies/confirmCorrectCompanyHandler";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { CompanyNameAndNumber } from "../../types/util-types";
import { getFullUrl, getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";

export const confirmCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const companyProfile = getExtraData(req.session, constants.COMPANY_PROFILE);

    const confirmCompanyDetailsIndicator = true;
    setExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR, confirmCompanyDetailsIndicator);

    const viewData = await new ConfirmCorrectCompanyHandler().execute(req.lang, companyProfile);
    res.render(constants.CONFIRM_COMPANY_PAGE, viewData);
};

export const confirmCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const company = getExtraData(req.session, constants.COMPANY_PROFILE);

    const confirmedCompanyForAssocation: CompanyNameAndNumber = {
        companyNumber: company.companyNumber,
        companyName: company.companyName
    };
    setExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
    const nextPageUrl = getUrlWithCompanyNumber(getFullUrl(constants.CREATE_COMPANY_ASSOCIATION_PATH), company.companyNumber);

    return res.redirect(nextPageUrl);
};
