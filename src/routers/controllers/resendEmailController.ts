import { Request, Response } from "express";
import * as constants from "../../constants";
import { isEmailAuthorised } from "../../services/userCompanyAssociationService";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { sendAuthorisationEmail } from "../../services/emailNotificationService";
import logger from "../../lib/Logger";
import { validateEmailString } from "../../lib/validation/generic";

export const resendEmailController = async (req: Request, res: Response) => {
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const email = req.params[constants.USER_EMAIL];
    const validEmail = validateEmailString(email);
    let emailOnList = false;
    if (validEmail) {
        emailOnList = await isEmailAuthorised(email, companyNumber);
    }
    if (!validEmail || !emailOnList) {
        logger.info(
            `Email ${email} invalid or not on the authorisation list for company ${companyNumber}`
        );
    } else {
        const emailSendResponse = await sendAuthorisationEmail(
            email,
            companyNumber
        );

        if (emailSendResponse.httpStatusCode === 201) {
            setExtraData(req.session, "resentSuccessEmail", email);
            return res.redirect(
                constants.MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_EMAIL_RESENT_URL.replace(
                    `:${constants.COMPANY_NUMBER}`,
                    companyNumber
                )
            );
        }
    }
    return res.status(404).render(constants.ERROR_400_TEMPLATE);
};
