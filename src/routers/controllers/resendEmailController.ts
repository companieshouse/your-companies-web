import { Request, Response } from "express";
import * as constants from "../../constants";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import logger from "../../lib/Logger";
import { validateEmailString } from "../../lib/validation/generic";
import { createAssociation } from "../../services/associationsService";
import { getFullUrl } from "../../lib/utils/urlUtils";

export const resendEmailController = async (req: Request, res: Response): Promise<void> => {
    const companyNumber = getExtraData(req.session, constants.COMPANY_NUMBER);
    const email = req.params[constants.USER_EMAIL];
    const validEmail = validateEmailString(email);

    if (!validEmail) {
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
