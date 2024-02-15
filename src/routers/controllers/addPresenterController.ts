import { Request, Response } from "express";
import { pages } from "../../constants";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";
import { isEmailAuthorised } from "../../services/userCompanyAssociationService";
import { ViewData } from "../../types/util-types";
import { validateEmailString } from "../../lib/validation/generic";
import { setExtraData } from "../../lib/utils/sessionUtils";

export const addPresenterController = async (
    req: Request,
    res: Response
) => {
    const company: CompanyProfile = await getCompanyProfile(
    req.params[constants.COMPANY_NUMBER] as string
    );
    const { companyName, companyNumber } = company;
    const viewData: ViewData = {
        lang: getTranslationsForView(req.t, pages.ADD_PRESENTER),
        companyName,
        companyNumber,
        errors: undefined,
        backLinkHref: constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            companyNumber
        )
    };

    if (req.method === constants.POST) {
        const setError = (prop: string) => {
            viewData.errors = {
                email: {
                    text: prop
                }
            };
        };
        const email = req.body.email.trim();
        if (!email) {
            setError(constants.ERRORS_EMAIL_REQUIRED);
        } else if (!validateEmailString(email)) {
            setError(constants.ERRORS_EMAIL_INVALID);
        } else if (await isEmailAuthorised(email, companyNumber)) {
            viewData.lang[constants.ERRORS_EMAIL_ALREADY_AUTHORISED] += companyName;
            setError(constants.ERRORS_EMAIL_ALREADY_AUTHORISED);
        }

        if (!viewData.errors) {
            setExtraData(req.session, constants.AUTHORISED_PERSON_EMAIL, email);
            return res.redirect(
                getUrlWithCompanyNumber(
                    constants.fullPathsWithCompanyAuth.CHECK_PRESENTER,
                    companyNumber
                )
            );
        }
    }

    res.render(pages.ADD_PRESENTER, viewData);
};
