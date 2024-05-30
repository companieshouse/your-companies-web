import { Associations, AssociationStatus } from "private-api-sdk-node/dist/services/associations/types";

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
        next: "http://localhost:8080/associations?page_index=2&itesm_per_page=15"
    },
    itemsPerPage: 20,
    pageNumber: 0,
    totalResults: 29,
    totalPages: 2
} as Associations;
