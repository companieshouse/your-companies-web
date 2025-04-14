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
        logger.info(
            `Email ${email} invalid or not on the authorisation list for company ${companyNumber}`
        );
        return res.status(400).redirect(getFullUrl(constants.SOMETHING_WENT_WRONG_URL));
    } else {
        const emailSendResponse: string = await createAssociation(req, companyNumber, email);
        if (emailSendResponse) {
            setExtraData(req.session, constants.RESENT_SUCCESS_EMAIL, email);

            return res.redirect(
                getFullUrl(constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL).replace(
                    `:${constants.COMPANY_NUMBER}`,
                    companyNumber
                )
            );
        }
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
