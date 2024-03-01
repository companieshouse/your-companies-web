import { Associations } from "../../src/types/associations";

jest.mock("../../src/services/userCompanyAssociationService");

export const userAssociations: Associations = {
    items: [
        {
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "confirmed"
        },
        {
            id: "2345678901",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: "confirmed"
        }
    ]
} as Associations;

export const userAssociationsWithEmptyInvitations: Associations = {
    items: [
        {
            id: "1234567890",
            userId: "qwertyiop",
            displayName: "Not provided",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "awaiting-approval",
            invitations: []
        },
        {
            id: "2345678901",
            userId: "qwertyiop",
            displayName: "Not provided",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: "awaiting-approval",
            invitations: []
        }
    ]
} as Associations;

export const companyAssociations: Associations = {
    items: [
        {
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Awaiting confirmation"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "john.smith@test.com",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Confirmed"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "eva.brown@company.com",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Awaiting confirmation"
        },
        {
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "mark.black@private.com",
            displayName: "Mark Black",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "Confirmed"
        }
    ]
} as Associations;

export const emptyAssociations: Associations = {
    items: []
};

export const associationsWithInvitations: Associations = {
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
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "1122334455",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    },
                    {
                        invitedBy: "5544332211",
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
                        invitedBy: "75853993475",
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
            status: "confirmed",
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
