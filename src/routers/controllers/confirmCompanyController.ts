import { Request, Response } from "express";
import { ConfirmCorrectCompanyHandler } from "../handlers/yourCompanies/confirmCorrectCompanyHandler";
import * as constants from "../../constants";
import { Session } from "@companieshouse/node-session-handler";
import { getLoggedInUserEmail, setExtraData } from "../../lib/utils/sessionUtils";
import { isCompanyAssociatedWithUser } from "../../services/associationsService";
import * as urlUtils from "../../lib/utils/urlUtils";
import { CompanyNameAndNumber } from "../../types/util-types";

export const confirmCompanyControllerGet = async (req: Request, res: Response): Promise<void> => {
    const session: Session = req.session as Session;
    const companyProfile = session.data.extra_data.companyProfile;
    const viewData = await new ConfirmCorrectCompanyHandler().execute(req.t, companyProfile, req.language);
    res.render(constants.CONFIRM_COMPANY_PAGE, viewData);
};

export const confirmCompanyControllerPost = async (req: Request, res: Response): Promise<void> => {
    const session: Session = req.session as Session;
    const company = session.data.extra_data.companyProfile;
    const userEmailAddress = getLoggedInUserEmail(req.session);
    const companyNotActive = company.companyStatus.toLocaleLowerCase() !== constants.COMPANY_STATUS_ACTIVE;

    const isAlreadyAssociated = await isCompanyAssociatedWithUser(req, company.companyNumber, userEmailAddress);
    const associationExists = isAlreadyAssociated === constants.COMPNANY_ASSOCIATED_WITH_USER;

    let nextPageUrl = "";

    if (companyNotActive || associationExists) {
        nextPageUrl = constants.YOUR_COMPANIES_ADD_COMPANY_URL;
    } else {
        const confirmedCompanyForAssocation: CompanyNameAndNumber = {
            companyNumber: company.companyNumber,
            companyName: company.companyName
        };
        setExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssocation);
        nextPageUrl = urlUtils.getUrlWithCompanyNumber(constants.CREATE_COMPANY_ASSOCIATION_PATH_FULL, company.companyNumber);
    }
    return res.redirect(nextPageUrl);

};
