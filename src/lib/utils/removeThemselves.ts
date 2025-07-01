import { Session } from "@companieshouse/node-session-handler";
import { getLoggedInUserEmail, getLoggedInUserId } from "./sessionUtils";

/**
 * Checks if the user is attempting to remove their own email.
 *
 * @param session - The current user session object.
 * @param removalEmail - The email address being removed.
 * @returns A boolean indicating whether the user is removing their own email.
 */
export const isRemovingThemselves = (session: Session, removalEmail: string): boolean => {
    return removalEmail === getLoggedInUserEmail(session);
};

/**
 * Checks if the user is attempting to remove themselves.
 *
 * @param session - The current user session object.
 * @param removalEmail - The email address being removed.
 * @returns A boolean indicating whether the user is removing their own email.
 */
export const isRemovingThemselvesById = (session: Session, id: string): boolean => {
    return id === getLoggedInUserId(session);
};
