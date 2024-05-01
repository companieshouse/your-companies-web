import { Request, Response } from "express";
import { RemoveAuthorisedPersonHandler } from "../handlers/yourCompanies/removeAuthorisedPersonHandler";
import * as constants from "../../constants";
import { deleteExtraData, getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { redirectPage } from "../../lib/utils/referrerUtils";

export const removeAuthorisedPersonControllerGet = async (req: Request, res: Response): Promise<void> => {
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = getExtraData(req.session, constants.REFERER_URL);
    const userEmail = req.params[constants.USER_EMAIL];
    const companyNumber = req.params[constants.COMPANY_NUMBER];
    const pageIndicator = getExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);
    const removePageUrl = (constants.COMPANY_AUTH_PROTECTED_AUTHENTICATION_CODE_REMOVE_URL.replace(":companyNumber", companyNumber)).replace(":userEmail", userEmail);

    let checkedReferrer;
    let newPageIndicator;

    if (referrer && (referrer.includes("confirmation-person-removed") || referrer.includes("confirmation-cancel-person") || referrer.includes("confirmation-person-added"))) {
        checkedReferrer = hrefA;
    } else {
        checkedReferrer = referrer;
    }

    if (checkedReferrer?.includes("manage-authorised-people") && pageIndicator === true) {
        newPageIndicator = false;
    } else {
        newPageIndicator = pageIndicator;
    }

    setExtraData(req.session, constants.REMOVE_URL_EXTRA, removePageUrl);

    if (redirectPage(checkedReferrer, hrefA, constants.AUTHENTICATION_CODE_REMOVE_URL.replace(":userEmail", userEmail), newPageIndicator)) {
        res.redirect(constants.LANDING_URL);
    } else {
        const handler = new RemoveAuthorisedPersonHandler();
        const viewData = await handler.execute(req, constants.GET);
        deleteExtraData(req.session, constants.MANAGE_AUTHORISED_PEOPLE_INDICATOR);

        res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, {
            ...viewData
        });
    }
};

export const removeAuthorisedPersonControllerPost = async (req: Request, res: Response): Promise<void> => {
    const handler = new RemoveAuthorisedPersonHandler();
    const viewData = await handler.execute(req, constants.POST);
    if (viewData.errors && Object.keys(viewData.errors).length > 0) {
        res.render(constants.REMOVE_AUTHORISED_PERSON_PAGE, { ...viewData });
    } else {
        res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_CONFIRMATION_PERSON_REMOVED_URL.replace(`:${constants.COMPANY_NUMBER}`, viewData.companyNumber as string));
    }
};
