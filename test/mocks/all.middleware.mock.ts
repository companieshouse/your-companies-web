import mockAuthenticationMiddleware from "./authentication.middleware.mock";
import mockSessionMiddleware from "./session.middleware.mock";
import mockCompanyAuthenticationMiddleware from "./company.authentication.middleware.mock";
import mockCsrfProtectionMiddleware from "./csrf.protection.middleware.mock";

export default {
    mockAuthenticationMiddleware,
    mockCompanyAuthenticationMiddleware,
    mockSessionMiddleware,
    mockCsrfProtectionMiddleware
};
