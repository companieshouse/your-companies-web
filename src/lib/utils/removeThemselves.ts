import { Session } from "@companieshouse/node-session-handler";
import { getLoggedInUserEmail } from "./sessionUtils";

export const isRemovingThemselves = (session: Session, removalEmail:string):boolean => removalEmail === getLoggedInUserEmail(session);
