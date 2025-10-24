import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import logger, { createLogMessage } from "../../lib/Logger";
import { validateEmailString } from "../../lib/validation/generic";
import { inviteUser } from "../../services/associationsService";
import { getFullUrl } from "../../lib/utils/urlUtils";

/**
 * Validates the email string.
 *
 * @param email - The email string to validate.
 * @returns A boolean indicating whether the email is valid.
 */
const isValidEmail = (email: string): boolean => validateEmailString(email);

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
        logger.info(createLogMessage(req, resendEmailController.name, `Invalid email ${email} for company ${companyNumber}`));
        res.status(400).redirect(getFullUrl(constants.SOMETHING_WENT_WRONG_URL));
        return;
    }

    const emailSendResponse = await inviteUser(req, companyNumber, email);

    if (emailSendResponse) {
        setExtraData(req.session, constants.RESENT_SUCCESS_EMAIL, email);
        res.redirect(
            getFullUrl(constants.CONFIRMATION_AUTHORISATION_EMAIL_RESENT_URL)
        );
    }
};
