import { Request, Response } from "express";
import * as constants from "../../constants";
import { setExtraData } from "../../lib/utils/sessionUtils";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getCompanyProfile } from "../../services/companyProfileService";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";

export const beforeAddPresenterControllerGet = async (req: Request, res: Response): Promise<void> => {

    const company: CompanyProfile = await getCompanyProfile(
        req.params[constants.COMPANY_NUMBER]
    );
    const { companyNumber } = company;
    setExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL, undefined);
    setExtraData(req.session, "proposedEmail", undefined);

    const nextPageUrl = getUrlWithCompanyNumber(constants.YOUR_COMPANIES_ADD_PRESENTER_URL, companyNumber);
    return res.redirect(nextPageUrl);
};
