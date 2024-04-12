import { Request, Response } from "express";
import * as constants from "../../constants";
import { createAssociation, updateAssociationStatus } from "../../services/associationsService";
import { deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { AssociationState, AssociationStateResponse } from "../../types/associations";
import { AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";

export const createCompanyAssociationControllerGet = async (req: Request, res: Response): Promise<void> => {

    const confirmedCompanyForAssocation = getExtraData(req.session, constants.CONFIRMED_COMPANY_FOR_ASSOCIATION);
    const associationStateResponse: AssociationStateResponse = getExtraData(req.session, constants.ASSOCIATION_STATE_RESPONSE);
    const wasCompanyAssociated: boolean = associationStateResponse.state === AssociationState.COMPNANY_WAS_ASSOCIATED_WITH_USER;

    if (wasCompanyAssociated) {
        await updateAssociationStatus(req, associationStateResponse.associationId as string, AssociationStatus.CONFIRMED);
    } else {
        await createAssociation(req, confirmedCompanyForAssocation.companyNumber);
    }

    deleteExtraData(req.session, constants.ASSOCIATION_STATE_RESPONSE);

    const nextPageUrl = constants.YOUR_COMPANIES_COMPANY_ADDED_SUCCESS_URL;
    return res.redirect(nextPageUrl);

};
