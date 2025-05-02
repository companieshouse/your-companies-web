import { Request } from "express";
import { createOauthPrivateApiClient } from "./apiClientService";
import { Resource } from "@companieshouse/api-sdk-node";
import logger from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import * as constants from "../constants";
import {
    AssociationsResponse,
    AssociationList,
    AssociationStatus,
    Errors,
    NewAssociationResponse,
    InvitationList
} from "private-api-sdk-node/dist/services/associations/types";
import { AssociationState, AssociationStateResponse } from "../types/associations";
import createError from "http-errors";

/**
 * Converts API errors into a JSON string for logging or error handling.
 */
const stringifyApiErrors = (resource: Resource<AssociationsResponse | Errors | undefined | InvitationList>): string => {
    return JSON.stringify((resource.resource as Errors)?.errors || "No error list returned");
};

/**
 * Retrieves user associations based on the provided status, company number, and pagination details.
 */
export const getUserAssociations = async (
    req: Request,
    status: AssociationStatus[],
    companyNumber?: string,
    pageIndex?: number,
    itemsPerPage?: number
): Promise<AssociationList> => {
    const apiClient = createOauthPrivateApiClient(req);
    logger.info(`Looking for associations with status ${JSON.stringify(status)}`);

    const sdkResponse: Resource<AssociationList | Errors> = await apiClient.associationsService.searchAssociations(
        status, pageIndex, itemsPerPage, companyNumber
    );

    if (!sdkResponse) {
        const errorMessage = `No SDK Response returned from an associations API call for status ${JSON.stringify(status)}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to get associations with status ${JSON.stringify(status)}`;
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errorMessage = `Associations API returned no resource for associations with status ${JSON.stringify(status)}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    logger.debug(`Received associations ${JSON.stringify(sdkResponse)}`);
    return sdkResponse.resource as AssociationList;
};

/**
 * Determines if a company is or was associated with a user.
 */
export const isOrWasCompanyAssociatedWithUser = async (
    req: Request,
    companyNumber: string
): Promise<AssociationStateResponse> => {
    const statuses: AssociationStatus[] = [
        AssociationStatus.AWAITING_APPROVAL,
        AssociationStatus.CONFIRMED,
        AssociationStatus.REMOVED
    ];
    const userAssociations: AssociationList = await getUserAssociations(req, statuses, companyNumber);

    if (userAssociations.totalResults > 0) {
        const associationStatus: AssociationStatus = userAssociations.items[0].status;
        const isOrWasAssociated: AssociationState = {
            [AssociationStatus.CONFIRMED]: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
            [AssociationStatus.AWAITING_APPROVAL]: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER,
            [AssociationStatus.REMOVED]: AssociationState.COMPANY_WAS_ASSOCIATED_WITH_USER
        }[associationStatus];

        return { state: isOrWasAssociated, associationId: userAssociations.items[0].id };
    }

    return { state: AssociationState.COMPANY_NOT_ASSOCIATED_WITH_USER };
};

/**
 * Retrieves company associations based on the provided parameters.
 */
export const getCompanyAssociations = async (
    req: Request,
    companyNumber: string,
    userEmail?: string,
    includeRemoved?: boolean,
    pageIndex?: number,
    itemsPerPage?: number
): Promise<AssociationList> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<AssociationList | Errors> = await apiClient.associationsService.getCompanyAssociations(
        companyNumber, includeRemoved, pageIndex, itemsPerPage, userEmail
    );

    if (!sdkResponse) {
        const errorMessage = `Associations API for a company with company number ${companyNumber}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to get company associations, company number: ${companyNumber}`;
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errorMessage = `Associations API returned no resource for associations for a company with company number ${companyNumber}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    logger.debug(`Received associations for a company with company number ${companyNumber}`);
    return sdkResponse.resource as AssociationList;
};

/**
 * Creates a new association for a company.
 */
export const createAssociation = async (
    req: Request,
    companyNumber: string,
    inviteeEmailAddress?: string
): Promise<string> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<NewAssociationResponse | Errors> = await apiClient.associationsService.createAssociation(
        companyNumber, inviteeEmailAddress
    );

    if (!sdkResponse) {
        const errorMessage = `Associations API for a company with company number ${companyNumber}, the associations API response was null, undefined or falsy.`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to create association for a company with company number ${companyNumber}`;
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errorMessage = `Associations API returned no resource for creation of an association for a company with company number ${companyNumber}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    logger.debug(`Received the new association link for a company with company number ${companyNumber}`);
    const associationLink: string = (sdkResponse.resource as NewAssociationResponse).associationLink;

    return Promise.resolve(associationLink);
};

/**
 * Updates the status of an existing association.
 */
export const updateAssociationStatus = async (
    req: Request,
    associationId: string,
    status: AssociationStatus
): Promise<string> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<undefined | Errors> = await apiClient.associationsService.updateAssociationStatus(
        associationId, status
    );

    if (!sdkResponse) {
        const errorMessage = `Associations API for an association with id ${associationId}, the associations API response was null, undefined or falsy.`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to change status for an association with id ${associationId}`;
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    logger.debug(`The status of an association with id ${associationId} changed`);
    return associationId;
};

/**
 * Retrieves a list of invitations.
 */
export const getInvitations = async (
    req: Request,
    pageIndex?: number,
    itemsPerPage?: number
): Promise<InvitationList> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<InvitationList | Errors> = await apiClient.associationsService.getInvitations(
        pageIndex, itemsPerPage
    );

    if (!sdkResponse) {
        const errMsg = `No response from GET /associations/invitations`;
        logger.error(errMsg);
        throw new Error(errMsg);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /associations/invitations: ${sdkResponse.httpStatusCode}`;
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errMsg = `Invitations API returned sdkResponse but no resource`;
        logger.error(errMsg);
        throw new Error(errMsg);
    }

    logger.debug(`GET /associations/invitations: 200 OK`);
    logger.debug(`Received invitations ${JSON.stringify(sdkResponse)}`);
    return sdkResponse.resource as InvitationList;
};

/**
 * Sends an invitation to associate a user with a company.
 */
export const postInvitation = async (
    req: Request,
    companyNumber: string,
    inviteeEmailAddress: string
): Promise<string> => {
    const apiClient = createOauthPrivateApiClient(req);
    const sdkResponse: Resource<NewAssociationResponse | Errors> = await apiClient.associationsService.postInvitation(
        companyNumber, inviteeEmailAddress
    );

    if (!sdkResponse) {
        const errMsg = `No response from POST /associations/invitations`;
        logger.error(errMsg);
        throw new Error(errMsg);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        const errorMessage = `${sdkResponse.httpStatusCode} - POST /associations/invitations - `;
        logger.debug(errorMessage + stringifyApiErrors(sdkResponse));
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errMsg = `POST /associations/invitations: 201 status but no resource found`;
        throw new Error(errMsg);
    }

    logger.debug(`POST /associations/invitations success - company number ${companyNumber}`);
    logger.debug(`Received link for posted invite ${JSON.stringify(sdkResponse)}`);

    const associationLink: string = (sdkResponse.resource as NewAssociationResponse).associationLink;

    return Promise.resolve(associationLink);
};

/**
 * Removes a user from company associations by updating the association status to REMOVED.
 */
export const removeUserFromCompanyAssociations = async (
    req: Request,
    associationId: string
): Promise<string> => {
    if (associationId) {
        await updateAssociationStatus(req, associationId, AssociationStatus.REMOVED);
        return constants.USER_REMOVED_FROM_COMPANY_ASSOCIATIONS;
    } else {
        const errorMessage = "Error on removal/cancellation: associationId not provided";
        logger.error(errorMessage);
        throw createError(400, errorMessage);
    }
};
