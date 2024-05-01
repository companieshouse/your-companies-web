import { Request, Response } from "express";
import { ManageAuthorisedPeopleHandler } from "../handlers/yourCompanies/manageAuthorisedPeopleHandler";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const manageAuthorisedPeopleControllerGet = async (req: Request, res: Response): Promise<void> => {
    const referrer :string|undefined = req.get("Referrer");
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const cancelPageUrl = getExtraData(req.session, constants.CANCEL_URL_EXTRA);
    const removePageUrl = getExtraData(req.session, constants.REMOVE_URL_EXTRA);

    if (req.originalUrl.includes(constants.CONFIRMATION_PERSON_ADDED) &&
        redirectPage(referrer,
            constants.YOUR_COMPANIES_CHECK_PRESENTER_URL.replace(":companyNumber", companyNumber),
            constants.YOUR_COMPANIES_AUTHORISED_PERSON_ADDED_URL.replace(":companyNumber", companyNumber), pageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else if (req.originalUrl.includes(constants.CONFIRMATION_PERSON_REMOVED_URL) &&
    redirectPage(referrer, removePageUrl, constants.CONFIRMATION_PERSON_REMOVED_URL, pageIndicator)) {
        deleteExtraData(req.session, constants.REMOVE_URL_EXTRA);
        res.redirect(constants.LANDING_URL);
    } else if (req.originalUrl.includes(constants.CONFIRMATION_CANCEL_PERSON_URL) &&
    redirectPage(referrer, cancelPageUrl, constants.CONFIRMATION_CANCEL_PERSON_URL, pageIndicator)) {
        deleteExtraData(req.session, constants.CANCEL_URL_EXTRA);
        res.redirect(constants.LANDING_URL);
    } else {
        const handler = new ManageAuthorisedPeopleHandler();
        const viewData = await handler.execute(req);
        const managedAuthorisedPeopleIndicator = true;

        if (getExtraData(req.session, constants.CANCEL_URL_EXTRA)) {
            deleteExtraData(req.session, constants.CANCEL_URL_EXTRA);
        }
        if (getExtraData(req.session, constants.REMOVE_URL_EXTRA)) {
            deleteExtraData(req.session, constants.REMOVE_URL_EXTRA);
        }
        setExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR, managedAuthorisedPeopleIndicator);

        res.render(constants.MANAGE_AUTHORISED_PEOPLE_PAGE, {
            ...viewData
        });
    }
};
