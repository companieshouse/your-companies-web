import { Associations, AssociationStatus, Invitation } from "private-api-sdk-node/dist/services/associations/types";

export const userAssociations: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 15,
    pageNumber: 0,
    totalResults: 2,
    totalPages: 1
} as Associations;

export const demoUserPolishBreweryAssociation: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 15,
    pageNumber: 0,
    totalResults: 1,
    totalPages: 1
} as Associations;

export const demoUserScottishBreweryAssociation: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1122334455",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "AB012345",
            companyName: "THE SCOTTISH BREWERY",
            status: AssociationStatus.REMOVED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "2023-03-05T11:41:09.568+00:00 UTC",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 15,
    pageNumber: 0,
    totalResults: 1,
    totalPages: 1
} as Associations;

export const demoUserGermanBreweryAssociation: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567888",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038333",
            companyName: "THE GERMAN BREWERY",
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [
                {
                    invitedBy: "john.smith@test.com",
                    invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                }
            ],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 15,
    pageNumber: 0,
    totalResults: 1,
    totalPages: 1
} as Associations;

export const userAssociationsWithEmptyInvitations: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            displayName: "Not provided",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "qwertyiop",
            displayName: "Not provided",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 1,
    pageNumber: 2,
    totalResults: 0,
    totalPages: 4
} as Associations;

export const userAssociationsWithNumberOfInvitations: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [
                {
                    invitedBy: "john.smith@test.com",
                    invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                }
            ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "qwertyiop",
            displayName: "Not provided",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [
                {
                    invitedBy: "john.smith@test.com",
                    invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                }
            ],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 1,
    pageNumber: 2,
    totalResults: 2,
    totalPages: 4
} as Associations;

export const validInvitation: Invitation = {
    invitedAt: new Date().toString(),
    invitedBy: "j.smith@test.com"
};

export const companyAssociations: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [
                validInvitation
            ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "john.smith@test.com",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "eva.brown@company.com",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [
                validInvitation
            ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "jsldkfjsd",
            userEmail: "mark.black@private.com",
            displayName: "Mark Black",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations: [],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 1,
    pageNumber: 2,
    totalResults: 3,
    totalPages: 4
} as Associations;

export const emptyAssociations: Associations = {
    items: [],
    links: {
        self: "",
        next: ""
    },
    itemsPerPage: 1,
    pageNumber: 0,
    totalResults: 0,
    totalPages: 0
};

export const associationsWithInvitations: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "44345677554",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "10866549",
            companyName: "ANDROID TECHNOLOGY LTD",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "j.example@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "234322344",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "08449801",
            companyName: "BROWN AND SALTER LIMITED",
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "another.email@acme.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ]

        },
        {
            etag: "ABC",
            id: "6654463562412",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "18882777",
            companyName: "FLOWERS LIMITED",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 1,
    pageNumber: 2,
    totalResults: 3,
    totalPages: 4
} as Associations;

export const twentyConfirmedAssociations: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.org",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "01777777",
            companyName: "BRITISH AIRWAYS PLC",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.org",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "44345677554",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "10866549",
            companyName: "ANDROID TECHNOLOGY LTD",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "j.example@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "234322344",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "08449801",
            companyName: "BROWN AND SALTER LIMITED",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "another.email@acme.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "6654463562412",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "18882777",
            companyName: "FLOWERS LIMITED",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "665121212",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "11223344",
            companyName: "ACME LIMITED",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "j.example@gmail.com5566",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "44332211",
            companyName: "GIANT CORP PLC",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI123123",
            companyName: "ABC LTD",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "72903908",
            companyName: "LARKIN GROUP",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "47204431",
            companyName: "TREMBLAY LLC LIMITED",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "35293830",
            companyName: "THIEL INC",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "87644034",
            companyName: "BAILEY - LEMKE",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "43593313",
            companyName: "SWIFT GROUP",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "27285558",
            companyName: "ANDERSON AND SONS",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "81683662",
            companyName: "GREENFELDER LTD",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "97023425",
            companyName: "ROBERTS AND SMITH",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "93678579",
            companyName: "VON, WIEGAND AND LYNCH",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "39763563",
            companyName: "JONES AND CONNELLY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "BAT12881",
            companyName: "WAYNE ENTERPRISES",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "16958380",
            companyName: "WITTING, BODE AND COX",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 20,
    pageNumber: 0,
    totalResults: 29,
    totalPages: 2
} as Associations;

export const oneConfirmedAssociation: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.org",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 15,
    pageNumber: 0,
    totalResults: 1,
    totalPages: 1
} as Associations;

export const companyAssociationsPage1: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.org",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "qwertyiop",
            userEmail: "demo1@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.org",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "44345677554",
            userId: "qwertyiop",
            userEmail: "demo2@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "j.example@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "234322344",
            userId: "qwertyiop",
            userEmail: "demo3@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "another.email@acme.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "6654463562412",
            userId: "qwertyiop",
            userEmail: "demo4@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "665121212",
            userId: "qwertyiop",
            userEmail: "demo5@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "j.example@gmail.com5566",
            userId: "qwertyiop",
            userEmail: "demo6@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo7@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo8@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo9@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo10@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo11@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo12@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo13@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "1A2B3C4",
            userId: "qwertyiop",
            userEmail: "demo14@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "hannah.salt@gmail.com",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&items_per_page=15"
    },
    itemsPerPage: 15,
    pageNumber: 1,
    totalResults: 20,
    totalPages: 2
} as Associations;

export const companyAssociationsPage2: Associations = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.org",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        },
        {
            etag: "ABC",
            id: "2345678901",
            userId: "qwertyiop",
            userEmail: "demo1@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
            invitations:
                [
                    {
                        invitedBy: "adam.smith@test.org",
                        invitedAt: "2022-04-05T11:41:09.568+00:00 UTC"
                    }
                ],
            links: {
                self: "/12345"
            }
        }
    ],
    links: {
        self: "http://localhost:8080/associations",
        next: "http://localhost:8080/associations?page_index=2&items_per_page=15"
    },
    itemsPerPage: 15,
    pageNumber: 2,
    totalResults: 17,
    totalPages: 2
} as Associations;
