import { CsrfProtectionMiddleware } from "@companieshouse/web-security-node";
import { sessionStore } from "./session.middleware";
import * as constants from "../constants";

export const csrfProtectionMiddleware = CsrfProtectionMiddleware({
    sessionStore,
    enabled: true,
    sessionCookieName: constants.COOKIE_NAME
});
