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
    ],
    totalResults: 0
} as Associations;

export const userAssociationsWithNumberOfInvitations: Associations = {
    items: [
        {
            id: "1234567890",
            userId: "qwertyiop",
            displayName: "Not provided",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: "awaiting-approval",
            invitations: [
                {
                    invitedBy: "123454321",
                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                }
            ]
        },
        {
            id: "2345678901",
            userId: "qwertyiop",
            displayName: "Not provided",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: "awaiting-approval",
            invitations: [
                {
                    invitedBy: "123454321",
                    invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                }
            ]
        }
    ],
    totalResults: 2
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
    items: [],
    totalResults: 0
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

export const twentyConfirmedAssociations: Associations = {
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
                    }
                ]
        },
        {
            id: "234322344",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "08449801",
            companyName: "BROWN AND SALTER LIMITED",
            status: "confirmed",
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

        },
        {
            id: "665121212",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "11223344",
            companyName: "ACME LIMITED",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "11223344555566",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "44332211",
            companyName: "GIANT CORP PLC",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI123123",
            companyName: "ABC LTD",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "72903908",
            companyName: "LARKIN GROUP",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "47204431",
            companyName: "TREMBLAY LLC LIMITED",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "35293830",
            companyName: "THIEL INC",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "87644034",
            companyName: "BAILEY - LEMKE",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "43593313",
            companyName: "SWIFT GROUP",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "27285558",
            companyName: "ANDERSON AND SONS",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "81683662",
            companyName: "GREENFELDER LTD",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "97023425",
            companyName: "ROBERTS AND SMITH",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "93678579",
            companyName: "VON, WIEGAND AND LYNCH",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "39763563",
            companyName: "JONES AND CONNELLY",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "BAT12881",
            companyName: "WAYNE ENTERPRISES",
            status: "confirmed",
            invitations:
                [
                    {
                        invitedBy: "76896789",
                        invitedAy: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "16958380",
            companyName: "WITTING, BODE AND COX",
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
