import { Request } from "express";
import { createOauthPrivateApiClient } from "./apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import * as constants from "../constants";
import { AssociationsResponse, AssociationList, AssociationStatus, Errors, NewAssociationResponse, InvitationList } from "private-api-sdk-node/dist/services/associations/types";
import { AssociationState, AssociationStateResponse } from "../types/associations";
import createError from "http-errors";

const stringifyApiErrors = (resource: Resource<AssociationsResponse | Errors | undefined | InvitationList>) => {
    return JSON.stringify((resource.resource as Errors)?.errors || "No error list returned");
};

export const getUserAssociations = async (req: Request, status: AssociationStatus[], companyNumber?: string, pageIndex?: number, itemsPerPage?: number): Promise<AssociationList> => {
    const apiClient = createOauthPrivateApiClient(req);

    logger.info(`Looking for associations with status ${JSON.stringify(status)}`);
    const sdkResponse: Resource<AssociationList | Errors> = await apiClient.associationsService.searchAssociations(status, pageIndex, itemsPerPage, companyNumber);

    if (!sdkResponse) {
        logger.error(`Associations API for status ${JSON.stringify(status)}`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to get associations with status ${JSON.stringify(status)}`;
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        logger.error(`Associations API returned no resource for associations with status ${JSON.stringify(status)}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`Received associations ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource as AssociationList);
};

export const isOrWasCompanyAssociatedWithUser = async (req: Request, companyNumber: string): Promise<AssociationStateResponse> => {
    const statuses: AssociationStatus[] = [AssociationStatus.AWAITING_APPROVAL, AssociationStatus.CONFIRMED, AssociationStatus.REMOVED];
    const userAssociations: AssociationList = await getUserAssociations(req, statuses, companyNumber);
    let isOrWasAssociated: AssociationState;
    let associationId;
    if (userAssociations.totalResults > 0) {
        const associationStatus: AssociationStatus = userAssociations.items[0].status;
        switch (associationStatus) {
        case AssociationStatus.CONFIRMED:
            isOrWasAssociated = AssociationState.COMPNANY_ASSOCIATED_WITH_USER;
            break;
        case AssociationStatus.AWAITING_APPROVAL:
            isOrWasAssociated = AssociationState.COMPNANY_AWAITING_ASSOCIATION_WITH_USER;
            break;
        case AssociationStatus.REMOVED:
            isOrWasAssociated = AssociationState.COMPNANY_WAS_ASSOCIATED_WITH_USER;
            break;
        }
        associationId = userAssociations.items[0].id;
    } else {
        isOrWasAssociated = AssociationState.COMPNANY_NOT_ASSOCIATED_WITH_USER;
    }

    return Promise.resolve({ state: isOrWasAssociated, associationId });
};

export const getCompanyAssociations = async (req: Request, companyNumber: string, userEmail?: string, includeRemoved?: boolean, pageIndex?: number): Promise<AssociationList> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<AssociationList | Errors> = await apiClient.associationsService.getCompanyAssociations(companyNumber, includeRemoved, pageIndex, undefined, userEmail);

    if (!sdkResponse) {
        logger.error(`Associations API for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} -  Failed to get company associations, company number: ${companyNumber}}`;
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        logger.error(`Associations API returned no resource for associations for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`Received associations for a company with company number ${companyNumber}`);

    return Promise.resolve(sdkResponse.resource as AssociationList);
};

export const createAssociation = async (req: Request, companyNumber: string, inviteeEmailAddress?: string): Promise<string> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<NewAssociationResponse | Errors> = await apiClient.associationsService.createAssociation(companyNumber, inviteeEmailAddress);

    if (!sdkResponse) {
        logger.error(`Associations API for a company with company number ${companyNumber}, the associations API response was null, undefined or falsy.`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to create association for a company with company number ${companyNumber}`;
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        logger.error(`Associations API returned no resource for creation of an association for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`Received the new association id for a company with company number ${companyNumber}`);
    const associationId: string = (sdkResponse.resource as NewAssociationResponse).associationId;

    return Promise.resolve(associationId);
};

export const updateAssociationStatus = async (req: Request, associationId: string, status: AssociationStatus): Promise<string> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<undefined | Errors> = await apiClient.associationsService.updateAssociationStatus(associationId, status);

    if (!sdkResponse) {
        logger.error(`Associations API for an association with id ${associationId}, the associations API response was null, undefined or falsy.`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to change status for an association with id ${associationId}`;
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    logger.debug(`The status of an association with id ${associationId} changed`);

    return Promise.resolve(associationId);
};

export const getInvitations = async (req: Request, pageIndex?: number, itemsPerPage?: number): Promise<InvitationList> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<InvitationList | Errors> = await apiClient.associationsService.getInvitations(pageIndex, itemsPerPage);

    if (!sdkResponse) {
        const errMsg = `No response from GET /associations/invitations`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /associations/invitations: ${sdkResponse.httpStatusCode}`;
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }
    if (!sdkResponse.resource) {
        const errMsg = `Invitations API returned sdkResponse but no resource`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }
    logger.debug(`GET /associations/invitations: 200 OK`);
    logger.debug(`Received invitations ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource as InvitationList);
};

export const postInvitation = async (req: Request, companyNumber: string, inviteeEmailAddress: string): Promise<string> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<NewAssociationResponse | Errors> = await apiClient.associationsService.postInvitation(companyNumber, inviteeEmailAddress);

    if (!sdkResponse) {
        const errMsg = `No response from POST /associations/invitations`;
        logger.error(errMsg);
        return Promise.reject(new Error(errMsg));
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        const errorMessage = `${sdkResponse.httpStatusCode} - POST /associations/invitations`;
        return Promise.reject(createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`));
    }

    if (!sdkResponse.resource) {
        const errMsg = `POST /associations/invitations: 201 status but no resource found`;
        return Promise.reject(new Error(errMsg));
    }

    logger.debug(`POST /associations/invitations success - company number ${companyNumber}`);
    logger.debug(`Received id for posted invite ${JSON.stringify(sdkResponse)}`);

    const associationId: string = (sdkResponse.resource as NewAssociationResponse).associationId;

    return Promise.resolve(associationId);
};

export const removeUserFromCompanyAssociations = async (req: Request, associationId: string): Promise<string> => {
    if (associationId) {
        await updateAssociationStatus(req, associationId, AssociationStatus.REMOVED);
        return Promise.resolve(constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
    } else {
        const errorMessage = "Error on removal/cancellation: associtionId not provided";
        logger.error(errorMessage);
        return Promise.reject(createError(400, errorMessage));
    }
};
