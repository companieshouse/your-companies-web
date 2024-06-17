import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import logger from "../../lib/Logger";
import { companyAuthenticationMiddleware } from "../company.authentication";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { AssociationStateResponse, AssociationState } from "../../types/associations";
import { CompanyNameAndNumber } from "../../types/util-types";

export const addCompanyJourneyCompanyAuth = (req: Request, res: Response, next: NextFunction): unknown => {
    const confirmedCompanyForAssocation:CompanyNameAndNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);

    const companyNumber = req.params[constants.COMPANY_NUMBER];
    if (companyNumber !== confirmedCompanyForAssocation.companyNumber) {
        throw new Error("addCompanyJourneyCompanyAuth: company number in url did not match company number saved in session");
    }

    const associationStateResponse: AssociationStateResponse = getExtraData(req.session, constants.ASSOCIATION_STATE_RESPONSE);

    if (associationStateResponse.state === AssociationState.COMPNANY_AWAITING_ASSOCIATION_WITH_USER) {
        logger.debug(`skipping company auth, assocation ${companyNumber}, ${associationStateResponse.state} exits`);
        return next();
    }
    logger.debug(`addCompanyJourneyCompanyAuth: redirecting to company auth, company number ${companyNumber}`);
    return companyAuthenticationMiddleware(req, res, next);
};
