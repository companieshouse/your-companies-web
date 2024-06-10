export interface Invitations {
    rows: ({ text: string } | { html: string })[][];
    acceptIds: string[];
    declineIds: string[];
}

export interface InvitationWithCompanyDetail {
    invitedBy: string;
    invitedAt: string;
    associationId: string;
    isActive: boolean;
    companyName: string;
    companyNumber: string;
}
