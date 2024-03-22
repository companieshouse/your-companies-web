import { Request } from "express";
import { createOauthPrivateApiClient } from "./apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import * as constants from "../constants";
import { Associations, AssociationStatus, Errors, NewAssociationResponse } from "@companieshouse/private-api-sdk-node/dist/services/associations/types";

export const getUserAssociations = async (req: Request, status: AssociationStatus[]): Promise<Associations> => {
    const apiClient = createOauthPrivateApiClient(req);

    logger.info(`Looking for associations with status ${JSON.stringify(status)}`);
    const sdkResponse: Resource<Associations | Errors> = await apiClient.associationsService.searchAssociations(status);

    if (!sdkResponse) {
        logger.error(`Associations API for status ${JSON.stringify(status)}`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to get associations with status ${JSON.stringify(status)}`);
        return Promise.reject(sdkResponse);
    }

    if (!sdkResponse.resource) {
        logger.error(`Associations API returned no resource for associations with status ${JSON.stringify(status)}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`Received associations ${JSON.stringify(sdkResponse)}`);

    return Promise.resolve(sdkResponse.resource as Associations);
};

export const isCompanyAssociatedWithUser = async (req: Request, companyNumber: string): Promise<string> => {
    const confirmedUserAssociations: Associations = await getUserAssociations(req, [AssociationStatus.CONFIRMED]);
    const isAssociated: boolean = confirmedUserAssociations.items.some((item) => item.companyNumber === companyNumber);

    return Promise.resolve(isAssociated ? constants.COMPNANY_ASSOCIATED_WITH_USER : constants.COMPNANY_NOT_ASSOCIATED_WITH_USER);
};

export const getCompanyAssociations = async (req: Request, companyNumber: string): Promise<Associations> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<Associations | Errors> = await apiClient.associationsService.getCompanyAssociations(companyNumber);

    if (!sdkResponse) {
        logger.error(`Associations API for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to get associations for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    if (!sdkResponse.resource) {
        logger.error(`Associations API returned no resource for associations for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`Received associations for a company with company number ${companyNumber}`);

    return Promise.resolve(sdkResponse.resource as Associations);
};

export const createAssociation = async (req: Request, companyNumber: string, inviteeEmailAddress?: string): Promise<string> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<NewAssociationResponse | Errors> = await apiClient.associationsService.createAssociation(companyNumber, inviteeEmailAddress);

    if (!sdkResponse) {
        logger.error(`Associations API for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to create association for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    if (!sdkResponse.resource) {
        logger.error(`Associations API returned no resource for creation of an association for a company with company number ${companyNumber}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`Received the new association id for a company with company number ${companyNumber}`);
    const associationId: string = (sdkResponse.resource as NewAssociationResponse).associationId;

    return Promise.resolve(associationId);
};

export const updateAssociationStatus = async (req: Request, associationId: string, status: AssociationStatus): Promise<void> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<undefined | Errors> = await apiClient.associationsService.updateAssociationStatus(associationId, status);

    if (!sdkResponse) {
        logger.error(`Associations API for an association with id ${associationId}`);
        return Promise.reject(sdkResponse);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        logger.error(`Http status code ${sdkResponse.httpStatusCode} - Failed to change status for an association with id ${associationId}`);
        return Promise.reject(sdkResponse);
    }

    logger.debug(`The status of an association with id ${associationId} changed`);
};

export const removeUserFromCompanyAssociations = async (req: Request, associationId: string): Promise<string> => {
    updateAssociationStatus(req, associationId, AssociationStatus.REMOVED);
    return Promise.resolve(constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS);
};

export const isEmailAuthorised = async (req: Request, email: string, companyNumber: string): Promise<boolean> => {
    const associations: Associations = await getCompanyAssociations(req, companyNumber);
    return associations.items.some(item => item.userEmail === email && item.status.includes(AssociationStatus.CONFIRMED));
};

export const isEmailInvited = async (req: Request, email: string, companyNumber: string): Promise<boolean> => {
    const associations: Associations = await getCompanyAssociations(req, companyNumber);
    return associations.items.some(item => item.userEmail === email && item.status.includes(AssociationStatus.AWAITING_APPROVAL));
};
