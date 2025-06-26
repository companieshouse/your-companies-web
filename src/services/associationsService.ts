import { Request } from "express";
import { Resource } from "@companieshouse/api-sdk-node";
import logger, { createLogMessage } from "../lib/Logger";
import { StatusCodes } from "http-status-codes";
import * as constants from "../constants";
import {
    Association,
    AssociationsResponse,
    AssociationList,
    AssociationStatus,
    Errors,
    NewAssociationResponse,
    InvitationList
} from "private-api-sdk-node/dist/services/associations/types";
import { AssociationState, AssociationStateResponse } from "../types/associations";
import createError from "http-errors";
import { makeApiCallWithRetry } from "./apiCallRetryService";
import { Session } from "@companieshouse/node-session-handler";

const ASSOCIATIONS_SERVICE = "associationsService";

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
    logger.info(createLogMessage(req.session, getUserAssociations.name, `Looking for associations with status ${JSON.stringify(status)}`));

    const sdkResponse = await makeApiCallWithRetry(
        ASSOCIATIONS_SERVICE,
        "searchAssociations",
        req,
        req.session as Session,
        status,
        pageIndex,
        itemsPerPage,
        companyNumber
    ) as Resource<AssociationList | Errors>;

    if (!sdkResponse) {
        const errorMessage = `No SDK Response returned from an associations API call for status ${JSON.stringify(status)}`;
        logger.error(createLogMessage(req.session, getUserAssociations.name, errorMessage));
        throw new Error(errorMessage);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to get associations with status ${JSON.stringify(status)}`;
        logger.error(createLogMessage(req.session, getUserAssociations.name, errorMessage));
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errorMessage = `Associations API returned no resource for associations with status ${JSON.stringify(status)}`;
        logger.error(createLogMessage(req.session, getUserAssociations.name, errorMessage));
        throw new Error(errorMessage);
    }

    logger.info(createLogMessage(req.session, getUserAssociations.name, `Received associations for company number ${companyNumber}`));
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
        AssociationStatus.REMOVED,
        AssociationStatus.MIGRATED
    ];
    const userAssociations: AssociationList = await getUserAssociations(req, statuses, companyNumber);

    if (userAssociations.totalResults > 0) {
        const associationStatus: AssociationStatus = userAssociations.items[0].status;
        const isOrWasAssociated: AssociationState = {
            [AssociationStatus.CONFIRMED]: AssociationState.COMPANY_ASSOCIATED_WITH_USER,
            [AssociationStatus.AWAITING_APPROVAL]: AssociationState.COMPANY_AWAITING_ASSOCIATION_WITH_USER,
            [AssociationStatus.MIGRATED]: AssociationState.COMPANY_MIGRATED_NOT_YET_ASSOCIATED_WITH_USER,
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
    const sdkResponse = await makeApiCallWithRetry(
        ASSOCIATIONS_SERVICE,
        "getCompanyAssociations",
        req,
        req.session as Session,
        companyNumber,
        includeRemoved,
        pageIndex,
        itemsPerPage,
        userEmail
    ) as Resource<AssociationList | Errors>;

    if (!sdkResponse) {
        const errorMessage = `Associations API for a company with company number ${companyNumber}`;
        logger.error(createLogMessage(req.session, getCompanyAssociations.name, errorMessage));
        throw new Error(errorMessage);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to get company associations, company number: ${companyNumber}`;
        logger.error(createLogMessage(req.session, getCompanyAssociations.name, errorMessage));
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errorMessage = `Associations API returned no resource for associations for a company with company number ${companyNumber}`;
        logger.error(createLogMessage(req.session, getCompanyAssociations.name, errorMessage));
        throw new Error(errorMessage);
    }

    logger.info(createLogMessage(req.session, getCompanyAssociations.name, `Received associations for a company with company number ${companyNumber}`));
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
    const sdkResponse = await makeApiCallWithRetry(
        ASSOCIATIONS_SERVICE,
        "createAssociation",
        req,
        req.session as Session,
        companyNumber,
        inviteeEmailAddress
    ) as Resource<NewAssociationResponse | Errors>;

    if (!sdkResponse) {
        const errorMessage = `Associations API for a company with company number ${companyNumber}, the associations API response was null, undefined or falsy.`;
        logger.error(createLogMessage(req.session, createAssociation.name, errorMessage));
        throw new Error(errorMessage);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to create association for a company with company number ${companyNumber}`;
        logger.error(createLogMessage(req.session, createAssociation.name, errorMessage));
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errorMessage = `Associations API returned no resource for creation of an association for a company with company number ${companyNumber}`;
        logger.error(createLogMessage(req.session, createAssociation.name, errorMessage));
        throw new Error(errorMessage);
    }

    logger.info(createLogMessage(req.session, createAssociation.name, `Received the new association link for a company with company number ${companyNumber}`));
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
    const sdkResponse = await makeApiCallWithRetry(
        ASSOCIATIONS_SERVICE,
        "updateAssociationStatus",
        req,
        req.session as Session,
        associationId,
        status
    ) as Resource<undefined | Errors>;

    if (!sdkResponse) {
        const errorMessage = `Associations API for an association with id ${associationId}, the associations API response was null, undefined or falsy.`;
        logger.error(createLogMessage(req.session, updateAssociationStatus.name, errorMessage));
        throw new Error(errorMessage);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `Http status code ${sdkResponse.httpStatusCode} - Failed to change status for an association with id ${associationId}`;
        logger.error(createLogMessage(req.session, updateAssociationStatus.name, errorMessage));
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    logger.info(createLogMessage(req.session, updateAssociationStatus.name, `The status of an association with id ${associationId} changed`));
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
    const sdkResponse = await makeApiCallWithRetry(
        ASSOCIATIONS_SERVICE,
        "getInvitations",
        req,
        req.session as Session,
        pageIndex,
        itemsPerPage
    ) as Resource<InvitationList | Errors>;

    if (!sdkResponse) {
        const errMsg = `No response from GET /associations/invitations`;
        logger.error(createLogMessage(req.session, getInvitations.name, errMsg));
        throw new Error(errMsg);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.OK) {
        const errorMessage = `GET /associations/invitations: ${sdkResponse.httpStatusCode}`;
        logger.debug(createLogMessage(req.session, getInvitations.name, errorMessage + stringifyApiErrors(sdkResponse)));
        logger.error(createLogMessage(req.session, getInvitations.name, errorMessage));
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errMsg = `Invitations API returned sdkResponse but no resource`;
        logger.error(createLogMessage(req.session, getInvitations.name, errMsg));
        throw new Error(errMsg);
    }

    logger.info(createLogMessage(req.session, getInvitations.name, `GET /associations/invitations: 200 OK`));
    logger.debug(createLogMessage(req.session, getInvitations.name, `Received invitations ${JSON.stringify(sdkResponse)}`));
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
    const sdkResponse = await makeApiCallWithRetry(
        ASSOCIATIONS_SERVICE,
        "postInvitation",
        req,
        req.session as Session,
        companyNumber,
        inviteeEmailAddress
    ) as Resource<NewAssociationResponse | Errors>;

    if (!sdkResponse) {
        const errMsg = `No response from POST /associations/invitations`;
        logger.error(createLogMessage(req.session, postInvitation.name, errMsg));
        throw new Error(errMsg);
    }

    if (sdkResponse.httpStatusCode !== StatusCodes.CREATED) {
        const errorMessage = `${sdkResponse.httpStatusCode} - POST /associations/invitations - `;
        logger.debug(createLogMessage(req.session, postInvitation.name, errorMessage + stringifyApiErrors(sdkResponse)));
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)} ${errorMessage}`);
    }

    if (!sdkResponse.resource) {
        const errMsg = `POST /associations/invitations: 201 status but no resource found`;
        throw new Error(errMsg);
    }

    logger.info(createLogMessage(req.session, postInvitation.name, `POST /associations/invitations success - company number ${companyNumber}`));
    logger.debug(createLogMessage(req.session, postInvitation.name, `Received link for posted invite ${JSON.stringify(sdkResponse)}`));

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
        logger.error(createLogMessage(req.session, removeUserFromCompanyAssociations.name, errorMessage));
        throw createError(400, errorMessage);
    }
};

export const getAssociationById = async (
    req: Request,
    associationId: string
): Promise<Association> => {
    const sdkResponse = await makeApiCallWithRetry(
        ASSOCIATIONS_SERVICE,
        "getAssociation",
        req,
                req.session as Session,
                associationId
    ) as Resource<Association | Errors>;

    if (sdkResponse?.httpStatusCode !== 200 || !sdkResponse.resource) {
        const errorMessage = `Error: getAssociationById: ${associationId} status: ${sdkResponse.httpStatusCode} `;
        logger.error(createLogMessage(req.session, getAssociationById.name, errorMessage));
        throw createError(sdkResponse.httpStatusCode, `${stringifyApiErrors(sdkResponse)}`);
    }
    return sdkResponse.resource as Association;
};
