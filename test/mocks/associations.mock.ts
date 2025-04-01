import {
    AssociationList,
    AssociationStatus,
    Invitation,
    ApprovalRoute,
    Association
} from "private-api-sdk-node/dist/services/associations/types";
import { CompanyStatuses } from "../../src/types/associations";

export const userAssociations: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const demoUserPolishBreweryAssociation: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const demoUserScottishBreweryAssociation: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1122334455",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "AB012345",
            companyName: "THE SCOTTISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.REMOVED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "2023-03-05T11:41:09.568+00:00 UTC",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const demoUserGermanBreweryAssociation: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567888",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038333",
            companyName: "THE GERMAN BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const userAssociationsWithEmptyInvitations: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            displayName: "Not provided",
            userEmail: "demo@ch.gov.uk",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const userAssociationsWithNumberOfInvitations: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const validInvitation: Invitation = {
    invitedAt: new Date().toString(),
    invitedBy: "j.smith@test.com",
    associationId: "12345",
    isActive: true
};

const date = new Date();
date.setDate(date.getDate() + 5);
const expiryDate = date.toISOString();

export const companyAssociations: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: expiryDate,
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: expiryDate,
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: expiryDate,
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: expiryDate,
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
} as AssociationList;

export const emptyAssociations: AssociationList = {
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

export const associationsWithoutInvitations: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC"
        },
        {
            etag: "ABC",
            id: "6654463562412",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "18882777",
            companyName: "FLOWERS LIMITED",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const twentyConfirmedAssociations: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const fifteenAssociationsAwaitingApproval: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.AWAITING_APPROVAL,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
    totalResults: 29,
    totalPages: 2
} as AssociationList;

export const oneConfirmedAssociation: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const companyAssociationsPage1: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const companyAssociationsPage2: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: "invitation",
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
} as AssociationList;

export const userAssociationWithCompanyStatus: AssociationList = {
    items: [
        {
            etag: "ABC",
            id: "1234567890",
            userId: "qwertyiop",
            userEmail: "demo@ch.gov.uk",
            displayName: "Not provided",
            companyNumber: "NI038379",
            companyName: "THE POLISH BREWERY",
            companyStatus: CompanyStatuses.ACTIVE,
            status: AssociationStatus.CONFIRMED,
            createdAt: "2022-03-05T11:41:09.568+00:00 UTC",
            approvedAt: "",
            removedAt: "",
            kind: "association",
            approvalRoute: ApprovalRoute.AUTH_CODE,
            approvalExpiryAt: "2022-05-05T11:41:09.568+00:00 UTC",
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
};

export const getAssociationList = (
    items: Association[],
    itemsPerPage: number,
    pageNumber: number,
    totalResults: number,
    totalPages: number
): AssociationList => ({
    items,
    links: {
        self: "",
        next: ""
    },
    itemsPerPage,
    pageNumber,
    totalResults,
    totalPages
});
