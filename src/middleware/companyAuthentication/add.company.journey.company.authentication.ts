import { NextFunction, Request, Response } from "express";
import * as constants from "../../constants";
import logger from "../../lib/Logger";
import { companyAuthenticationMiddleware } from "../company.authentication";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { AssociationStateResponse, AssociationState } from "../../types/associations";
import { CompanyNameAndNumber } from "../../types/util-types";

export const addCompanyJourneyCompanyAuth = (req: Request, res: Response, next: NextFunction): unknown => {
    console.log("1");
    const confirmedCompanyForAssocation:CompanyNameAndNumber = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
    console.log("2");

    const companyNumber = req.params[constants.COMPANY_NUMBER];
    if (companyNumber !== confirmedCompanyForAssocation.companyNumber) {
        console.log("3");

        throw new Error("addCompanyJourneyCompanyAuth: company number in url did not match company number saved in session");
    }
    console.log("4");

    const associationStateResponse: AssociationStateResponse = getExtraData(req.session, constants.ASSOCIATION_STATE_RESPONSE);
    console.log("5");

    if (associationStateResponse.state === AssociationState.COMPNANY_WAS_ASSOCIATED_WITH_USER ||
        associationStateResponse.state === AssociationState.COMPNANY_AWAITING_ASSOCIATION_WITH_USER) {
        logger.debug(`skipping company auth, assocation ${companyNumber}, ${associationStateResponse.state} exits`);
        return next();
    }
    console.log("6");

    logger.debug(`addCompanyJourneyCompanyAuth: redirecting to company auth, company number ${companyNumber}`);
    return companyAuthenticationMiddleware(req, res, next);
};
