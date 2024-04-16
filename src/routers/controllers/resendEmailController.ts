import { Request, Response } from "express";
import * as constants from "../../constants";
import { isEmailAuthorised } from "../../services/associationsService";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { sendAuthorisationEmail } from "../../services/emailNotificationService";
import logger from "../../lib/Logger";
import { validateEmailString } from "../../lib/validation/generic";

export const resendEmailController = async (req: Request, res: Response): Promise<void> => {
    console.time("resendEmailController");

    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const email = req.params[constants.USER_EMAIL];
    const validEmail = validateEmailString(email);
    let emailOnList = false;
    if (validEmail) {
        emailOnList = await isEmailAuthorised(req, email, companyNumber);
    }
    if (!validEmail || !emailOnList) {
        logger.info(
            `Email ${email} invalid or not on the authorisation list for company ${companyNumber}`
        );
        console.timeEnd("resendEmailController");

    } else {
        const emailSendResponse = await sendAuthorisationEmail(
            email,
            companyNumber
        );
        if (emailSendResponse.httpStatusCode === 201) {
            setExtraData(req.session, constants.RESENT_SUCCESS_EMAIL, email);

            return res.redirect(
                constants.YOUR_COMPANIES_CONFIRMATION_EMAIL_RESENT_URL.replace(
                    `:${constants.COMPANY_NUMBER}`,
                    companyNumber
                )
            );
        }
        console.timeEnd("resendEmailController");

    }

    return res.status(404).render(constants.ERROR_400_TEMPLATE);
};
