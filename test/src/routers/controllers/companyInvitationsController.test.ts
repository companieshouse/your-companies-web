import mocks from "../../../mocks/all.middleware.mock";
import app from "../../../../src/app";
import supertest from "supertest";
import * as en from "../../../../src/locales/en/translation/company-invitations.json";
import * as cy from "../../../../src/locales/cy/translation/company-invitations.json";
import { getUserAssociations } from "../../../../src/services/userCompanyAssociationService";
import { getUserRecord } from "../../../../src/services/userService";
import { Associations } from "../../../../src/types/associations";
jest.mock("../../../../src/services/userCompanyAssociationService");
jest.mock("../../../../src/services/userService");

const mockGetUserAssociations = getUserAssociations as jest.Mock;
const mockGetUserRecord = getUserRecord as jest.Mock;

const router = supertest(app);
const url = "/your-companies/company-invitations";

const associations: Associations = {
    items: [
        {
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "123454321",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]
        },
        {
            id: "2345678901",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "123454321",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]
        },
        {
            id: "44345677554",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "10866549",
            companyName: "ANDROID TECHNOLOGY LTD",
            status: "awaiting-approval",
            invitations:
                [
                    {
                        invitedBy: "1122334455",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    },
                    {
                        invitedBy: "75853993475",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]
        },
        {
            id: "234322344",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "08449801",
            companyName: "BROWN AND SALTER LIMITED",
            status: "awaiting-approval",
            invitations:
                [
                    {
                        invitedBy: "5544332211",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "6654463562412",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "18882777",
            companyName: "FLOWERS LIMITED",
            status: "awaiting-approval",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        }
    ]
} as Associations;

describe(`GET ${url}`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetUserAssociations.mockResolvedValueOnce(associations);
        mockGetUserRecord.mockResolvedValue({
            surname: "",
            email: "another.email@acme.com",
            user_id: "75853993475",
            roles: ""
        });
    });
    it("should check session, company and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should return expected English content if no language selected", async () => {
        const response = await router.get(`${url}`);
        expect(response.text).toContain(en.h1);
        expect(response.text).toContain(en.company_name);
        expect(response.text).toContain(en.company_number);
    });
    it("should return expected Welsh content if Welsh is selected", async () => {
        const response = await router.get(`${url}?lang=cy`);
        expect(response.text).toContain(cy.h1);
        expect(response.text).toContain(cy.company_name);
        expect(response.text).toContain(cy.company_number);
    });
    it("should return user email who created the invitation", async () => {
        const response = await router.get(`${url}?lang=cy`);
        const expectedEmail = "another.email@acme.com";
        const expectedCompanyNumber = "08449801";
        expect(response.text).toContain(expectedCompanyNumber);
        expect(response.text).toContain(expectedEmail);
    });
});
