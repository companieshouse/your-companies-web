import { Request, Response } from "express";
import * as constants from "../../constants";
import { getUserAssociations } from "../../services/userCompanyAssociationService";
import { getLoggedInUserEmail } from "../../lib/utils/sessionUtils";
import { Associations } from "../../types/associations";
import { getTranslationsForView } from "../../lib/utils/translations";
import { getUserRecord } from "../../services/userService";

export const companyInvitationsController = async (
    req: Request,
    res: Response
) => {
    const userEmailAddress = getLoggedInUserEmail(req.session);

    const userAssociations: Associations = await getUserAssociations(
        userEmailAddress
    );
    const viewData = {
        lang: getTranslationsForView(req.t, constants.COMPANY_INVITATIONS_PAGE),
        backLinkHref: constants.LANDING_URL
    };
    const awaitingApproval = userAssociations.items?.filter(item => item.status === "awaiting-approval");

    const rowsData = awaitingApproval.flatMap((item) => {
        // return item.invitations?.map((invite) => {
        //     const user = getUserRecord(invite.invited_by);

        //     return [
        //         { text: item.companyName },
        //         { text: item.companyNumber },
        //         { text: user?.email },
        //         {
        //             html: `<a href="/your-companies/company-invitations-accept/${item.id}" class="govuk-link govuk-link--no-visited-state">${viewData.lang.accept}</a>`
        //         },
        //         {
        //             html: `<a href="/your-companies/company-invitations-decline/${item.id}" class="govuk-link govuk-link--no-visited-state">${viewData.lang.decline}</a>`
        //         }
        //     ];
        // });
    });

    res.render(constants.COMPANY_INVITATIONS_PAGE, { ...viewData, rowsData });
};
