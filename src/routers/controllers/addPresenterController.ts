import { Request, Response } from "express";
import { pages } from "../../constants";
import {
    AnyRecord,
    getTranslationsForView
} from "../../lib/utils/translations";
import * as constants from "../../constants";
import { getCompanyProfile } from "../../services/companyProfileService";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";
import { getUrlWithCompanyNumber } from "../../lib/utils/urlUtils";
import { getCompanyAssociations } from "../../services/userCompanyAssociationService";
import { Associations } from "../../types/associations";

export const isValidEmail = (email: string): boolean => {
    //   logger.info(`Request to validate email: ${email}`);
    const regex =
    /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/gi;
    if (regex.test(email)) {
        return true;
    }
    return false;
};

export const VALID_EMAIL_REGEX_PATTERN = ".+[@].+[.].+";

// validateEmailString simple function that validates email string
export function validateEmailString (emailString: string): boolean {
    const regexResult: RegExpMatchArray | null = emailString.match(
        VALID_EMAIL_REGEX_PATTERN
    );
    if (regexResult !== null) {
        return true;
    }
    return false;
}

export const isEmailAuthorised = async (email: string, companyNumber:string): Promise<boolean> => {
    const companyAssociations: Associations = await getCompanyAssociations(companyNumber);
    return companyAssociations.items.some(item => item.userEmail.toLowerCase() === email.toLowerCase());
};

export const addPresenterControllerGet = async (
    req: Request,
    res: Response
) => {
    const company: CompanyProfile = await getCompanyProfile(
    req.params[constants.COMPANY_NUMBER] as string
    );

  type ViewData = {
    lang: AnyRecord;
    companyName: string;
    companyNumber: string;
    errors:
      | {
          [key: string]: {
            text: string;
          };
        }
      | undefined;
  };

  const viewData: ViewData = {
      lang: getTranslationsForView(req.t, pages.ADD_PRESENTER),
      companyName: company.companyName,
      companyNumber: company.companyNumber,
      errors: undefined
  };
  viewData.lang.errors_email_already_authorised += company.companyName;

  const setError = (prop: string) => {
      viewData.errors = {
          email: {
              text: prop
          }
      };
  };
  if (req.method === "POST") {
      const { email } = req.body;
      if (!email) {
          setError("errors_email_required");
      } else if (!validateEmailString(email)) {
          setError("errors_email_invalid");
      } else if (await isEmailAuthorised(email, company.companyNumber)) {
          setError("errors_email_already_authorised");
      }

      if (viewData.errors && Object.keys(viewData.errors).length > 0) {
          return res.render(pages.ADD_PRESENTER, viewData);
      } else {
          return res.redirect(
              getUrlWithCompanyNumber(
                  constants.fullPathsWithCompanyAuth.CHECK_PRESENTER,
                  company.companyNumber
              )
          );
      }
  }

  res.render(pages.ADD_PRESENTER, viewData);
};

// function item (value: Association, index: number, array: Association[]): value is Association {
//     throw new Error("Function not implemented.");
// }
// export const addPresenterControllerPost = async (req: Request, res: Response, next: NextFunction) => {
//     const email = req.body;
//     const viewData:any = {};

//     if (!email) {
//         viewData.errors = {
//             email: {
//                 text: "errors_email_required"
//             }
//         };
//     }

//     if (isValidEmail(email)) {
//         viewData.errors = {
//             email: {
//                 text: "errors_email_invalid"
//             }
//         };
//     };

//     const company: CompanyProfile = await getCompanyProfile(req.params[constants.COMPANY_NUMBER] as string);
//     const companyNumber = company.companyNumber;
//     if (viewData.errors && Object.keys(viewData.errors).length > 0) {
//         res.redirect(getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.ADD_PRESENTER, companyNumber));
//     } else {
//         res.redirect(getUrlWithCompanyNumber(constants.fullPathsWithCompanyAuth.CHECK_PRESENTER, companyNumber));
//     }
// };
