import { Request, Response, NextFunction } from "express";
import { ConfirmCorrectCompany } from "../handlers/yourCompanies/confirmCorrectCompany";
import * as constants from "../../constants";
import logger from "../../lib/Logger";
import { Session } from "@companieshouse/node-session-handler";
import { getLoggedInUserEmail } from "../../lib/utils/sessionUtils";
import { isCompanyAssociatedWithUser } from "../../services/userCompanyAssociationService";
import * as urlUtils from "../../lib/utils/urlUtils";

export const confirmCompanyGet = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug(`GET request for confirm company`);
    try {
        const session: Session = req.session as Session;
        const companyProfile = session.data.extra_data.companyProfile;
        const viewData = await new ConfirmCorrectCompany().execute(req.t, companyProfile);
        res.render(constants.CONFIRM_COMPANY_PAGE_TEMPLATE, viewData);
    } catch (e) {
        return next(e);
    }
};

export const confirmCompanyPost = async (req: Request, res: Response, next: NextFunction) => {
    logger.debug(`POST request for confirm company`);
    try {
        const session: Session = req.session as Session;
        const company = session.data.extra_data.companyProfile;
        const userEmailAddress = getLoggedInUserEmail(req.session);
        const companyNotActive = company.companyStatus.toLocaleLowerCase() !== constants.COMPANY_STATUS_ACTIVE;
        const isAlreadyAssociated = await isCompanyAssociatedWithUser(company.companyNumber, userEmailAddress);
        const associationExists = isAlreadyAssociated === constants.COMPNANY_ASSOCIATED_WITH_USER;

        let nextPageUrl = "";

        if (companyNotActive || associationExists) {
            nextPageUrl = constants.YOUR_COMPANIES_ADD_COMPANY_URL;
        } else {
            nextPageUrl = urlUtils.getUrlWithCompanyNumber(constants.CREATE_TRANSACTION_PATH_FULL, company.companyNumber);
        }
        logger.debug(`POST CONFIRM IS redirecting to ${nextPageUrl}`);
        return res.redirect(nextPageUrl);
    } catch (e) {
        return next(e);
    }
};
