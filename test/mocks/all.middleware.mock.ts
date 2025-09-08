import mockAuthenticationMiddleware from "./authentication.middleware.mock";
import { mockSessionMiddleware, mockEnsureSessionCookiePresentMiddleware } from "./session.middleware.mock";
import { mockCompanyAuthenticationMiddlewareCheckboxDisabled } from "./company.authentication.middleware.mock";
import mockCsrfProtectionMiddleware from "./csrf.protection.middleware.mock";
import mockNavigationMiddleware from "./navigation.middleware.mock";

export default {
    mockAuthenticationMiddleware,
    mockCompanyAuthenticationMiddlewareCheckboxDisabled,
    mockSessionMiddleware,
    mockEnsureSessionCookiePresentMiddleware,
    mockCsrfProtectionMiddleware,
    mockNavigationMiddleware
};
