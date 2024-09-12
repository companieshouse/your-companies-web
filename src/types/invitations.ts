export interface Invitations {
    rows: ({ text: string } | { html: string })[][];
}

export interface InvitationWithCompanyDetail {
    invitedBy: string;
    invitedAt: string;
    associationId: string;
    isActive: boolean;
    companyName: string;
    companyNumber: string;
}
