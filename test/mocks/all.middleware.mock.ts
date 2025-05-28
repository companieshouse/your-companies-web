import mockAuthenticationMiddleware from "./authentication.middleware.mock";
import { mockSessionMiddleware, mockEnsureSessionCookiePresentMiddleware } from "./session.middleware.mock";
import { mockCompanyAuthenticationMiddleware, mockForceCompanyAuthenticationMiddleware } from "./company.authentication.middleware.mock";
import mockCsrfProtectionMiddleware from "./csrf.protection.middleware.mock";

export default {
    mockAuthenticationMiddleware,
    mockCompanyAuthenticationMiddleware,
    mockSessionMiddleware,
    mockEnsureSessionCookiePresentMiddleware,
    mockCsrfProtectionMiddleware,
    mockForceCompanyAuthenticationMiddleware
};
