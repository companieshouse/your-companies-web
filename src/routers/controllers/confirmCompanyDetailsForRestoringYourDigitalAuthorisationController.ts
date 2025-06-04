import { Request, Response } from "express";
import { ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler } from "../handlers/yourCompanies/confirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { CompanyNameAndNumber } from "../../types/utilTypes";
import logger, { createLogMessage } from "../../lib/Logger";
import { tryRestoringYourDigitalAuthorisationFullUrl } from "../../lib/utils/urlUtils";

export const confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet = async (req: Request, res: Response): Promise<void> => {
    const companyProfile = getExtraData(req.session, constants.COMPANY_PROFILE);

    setExtraData(req.session, constants.CONFIRM_COMPANY_DETAILS_INDICATOR, true);

    const viewData = await new ConfirmCompanyDetailsForRestoringYourDigitalAuthorisationHandler().execute(req.lang, companyProfile);
    logger.info(
        createLogMessage(
            req.session,
            confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerGet.name,
            "Rendering confirm company details for restoring your digital authorisation page"
        ));
    res.render(constants.CONFIRM_COMPANY_PAGE, viewData);
};

export const confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost = async (req: Request, res: Response): Promise<void> => {
    const company = getExtraData(req.session, constants.COMPANY_PROFILE);

    const confirmedCompanyForAssociation: CompanyNameAndNumber = {
        companyNumber: company.companyNumber,
        companyName: company.companyName
    };

    setExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION, confirmedCompanyForAssociation);

    const nextPageUrl = tryRestoringYourDigitalAuthorisationFullUrl(company.companyNumber);
    logger.info(createLogMessage(req.session, confirmCompanyDetailsForRestoringYourDigitalAuthorisationControllerPost.name, `Redirecting to ${nextPageUrl}`));
    res.redirect(nextPageUrl);
};
