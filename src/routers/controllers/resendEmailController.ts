import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";
import { validateEmailString } from "../../lib/validation/generic";
import { createAssociation } from "../../services/associationsService";
import { getFullUrl } from "../../lib/utils/urlUtils";

/**
 * Handles the resend email functionality for a given company and user email.
 * Validates the email, attempts to resend the email, and redirects or renders an error page based on the outcome.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns A Promise that resolves to void.
 */
export const resendEmailController = async (req: Request, res: Response): Promise<void> => {
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const email = req.params[constants.USER_EMAIL];

    if (!isValidEmail(email)) {
        logInvalidEmail(email, companyNumber);
        return res.status(400).render(constants.SERVICE_UNAVAILABLE_TEMPLATE);
    }

    const emailSendResponse = await sendEmail(req, companyNumber, email);
    if (emailSendResponse) {
        handleSuccessfulEmailSend(req, res, companyNumber, email);
    } else {
        res.status(400).render(constants.SERVICE_UNAVAILABLE_TEMPLATE);
    }
};

/**
 * Validates the email string.
 *
 * @param email - The email string to validate.
 * @returns A boolean indicating whether the email is valid.
 */
const isValidEmail = (email: string): boolean => {
    return validateEmailString(email);
};

/**
 * Logs an invalid email attempt.
 *
 * @param email - The invalid email string.
 * @param companyNumber - The associated company number.
 */
const logInvalidEmail = (email: string, companyNumber: string): void => {
    logger.info(
        `Email ${email} invalid or not on the authorisation list for company ${companyNumber}`
    );
};

/**
 * Sends an email association request.
 *
 * @param req - The HTTP request object.
 * @param companyNumber - The company number.
 * @param email - The email to associate.
 * @returns A Promise that resolves to the email send response string.
 */
const sendEmail = async (req: Request, companyNumber: string, email: string): Promise<string> => {
    return createAssociation(req, companyNumber, email);
};

/**
 * Handles the successful email send scenario by updating the session and redirecting the user.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param companyNumber - The company number.
 * @param email - The email that was successfully sent.
 */
const handleSuccessfulEmailSend = (
    req: Request,
    res: Response,
    companyNumber: string,
    email: string
): void => {
    setExtraData(req.session, constants.RESENT_SUCCESS_EMAIL, email);
    const redirectUrl = getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL)
        .replace(`:${constants.COMPANY_NUMBER}`, companyNumber);
    res.redirect(redirectUrl);
};
