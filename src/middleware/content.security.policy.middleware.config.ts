import { HelmetOptions } from "helmet";

/**
 * Prepares the Content Security Policy (CSP) configuration for the application.
 *
 * @param nonce - A unique nonce value used for inline scripts.
 * @returns HelmetOptions - The configuration object for Helmet middleware.
 */
export const prepareCSPConfig = (nonce: string): HelmetOptions => {
    const CDN = process.env.CDN_HOST as string;
    const PIWIK_URL = process.env.PIWIK_URL as string;
    const PIWIK_CHS_DOMAIN = process.env.PIWIK_CHS_DOMAIN as string;
    const CHS_URL = process.env.CHS_URL as string;
    const HTTP_CHS_URL: string = CHS_URL.replace(/^https:\/\//, "http://");
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    const ONE_YEAR_SECONDS = 31536000;

    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN],
                imgSrc: [CDN],
                styleSrc: [NONCE, CDN],
                connectSrc: [SELF, PIWIK_URL],
                formAction: [
                    SELF,
                    `https://${PIWIK_CHS_DOMAIN}`,
                    `http://${PIWIK_CHS_DOMAIN}`,
                    CHS_URL,
                    HTTP_CHS_URL
                ],
                scriptSrc: [SELF, NONCE, CDN, PIWIK_URL],
                objectSrc: [`'none'`]
            }
        },
        referrerPolicy: {
            policy: ["same-origin"]
        },
        hsts: {
            maxAge: ONE_YEAR_SECONDS,
            includeSubDomains: true
        }
    };
};
