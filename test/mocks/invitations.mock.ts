import {
    Invitation,
    InvitationList
} from "@companieshouse/api-sdk-node/dist/services/associations/types";

const date = new Date();
date.setDate(date.getDate() + 5);
const expiryDate = date.toISOString();

export const mockInvitations: Invitation[] = [
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "1234567890",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "2345678901",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "44345677554",
        isActive: true
    },
    {
        invitedBy: "another.email@acme.com",
        invitedAt: expiryDate,
        associationId: "234322344",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "6654463562412",
        isActive: true
    }
];

export const mockInvitationList: InvitationList = {
    items: mockInvitations,
    itemsPerPage: 15,
    pageNumber: 1,
    totalResults: 1,
    totalPages: 1,
    links: {
        self: "",
        next: ""
    }
};

export const getMockInvitationList = (
    invitations: Invitation[]
): InvitationList => ({
    items: invitations,
    itemsPerPage: 15,
    pageNumber: 1,
    totalResults: 1,
    totalPages: 1,
    links: {
        self: "",
        next: ""
    }
});

export const getPaginatedMockInvitationList = (
    invitations: Invitation[]
): InvitationList => ({
    items: invitations,
    itemsPerPage: 15,
    pageNumber: 1,
    totalResults: 1,
    totalPages: 4,
    links: {
        self: "",
        next: ""
    }
});

export const fifteenMockInvitations: Invitation[] = [
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "1234567890",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "2345678901",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "44345677554",
        isActive: true
    },
    {
        invitedBy: "another.email@acme.com",
        invitedAt: expiryDate,
        associationId: "234322344",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "6654463562412",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "1234567890",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "2345678901",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "44345677554",
        isActive: true
    },
    {
        invitedBy: "another.email@acme.com",
        invitedAt: expiryDate,
        associationId: "234322344",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "6654463562412",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "1234567890",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "2345678901",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "44345677554",
        isActive: true
    },
    {
        invitedBy: "another.email@acme.com",
        invitedAt: expiryDate,
        associationId: "234322344",
        isActive: true
    },
    {
        invitedBy: "bob@bob.com",
        invitedAt: expiryDate,
        associationId: "6654463562412",
        isActive: true
    }
];
