import { Session } from "@companieshouse/node-session-handler";
import { getLoggedInUserEmail } from "./sessionUtils";

/**
 * Checks if the user is attempting to remove their own email.
 *
 * @param session - The current user session object.
 * @param removalEmail - The email address being removed.
 * @returns A boolean indicating whether the user is removing their own email.
 */
export const isRemovingThemselves = (session: Session, removalEmail: string): boolean => {
    // Compare the email being removed with the logged-in user's email
    return removalEmail === getLoggedInUserEmail(session);
};
