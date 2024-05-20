export interface Invitations {
    rows: ({ text: string } | { html: string })[][];
    acceptIds: string[];
    declineIds: string[];
}
