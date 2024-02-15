import { Request, Response } from "express";
import { pages } from "../../constants";
import { getTranslationsForView } from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";
import { Session } from "@companieshouse/node-session-handler";
import { polishBrewItems, britishAirwaysItems } from "../../services/userCompanyAssociationService";

export const checkPresenterController = async (req: Request, res: Response) => {
    const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
    const session: Session = req.session as Session;
    const emailAddress: string | undefined = session?.getExtraData(constants.AUTHORISED_PERSON_EMAIL);

    if (req.method === constants.POST) {
        if (company.companyNumber === "NI038379" && emailAddress) {
            polishBrewItems.items.push(
                {
                    id: "",
                    userId: "",
                    userEmail: emailAddress,
                    companyNumber: "NI038379",
                    companyName: "THE POLISH BREWERY",
                    status: "Awaiting confirmation",
                    displayName: ""
                }
            );
        }
        if (company.companyName === "01777777" && emailAddress) {
            polishBrewItems.items.push(
                {
                    id: "",
                    userId: "",
                    userEmail: emailAddress,
                    displayName: "",
                    companyNumber: "01777777",
                    companyName: "BRITISH AIRWAYS PLC",
                    status: "Awaiting confirmation"
                }
            );
        }
        return res.redirect(constants.YOUR_COMPANIES_MANAGE_AUTHORISED_PEOPLE_URL.replace(
            `:${constants.COMPANY_NUMBER}`,
            company.companyNumber
        ));
    }

    const viewData = {
        lang: getTranslationsForView(req.t, pages.CHECK_PRESENTER),
        companyName: company.companyName,
        companyNumber: company.companyNumber,
        emailAddress,
        backLinkHref: getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.ADD_PRESENTER, company.companyNumber)
    };
    res.render(pages.CHECK_PRESENTER, viewData);
};
