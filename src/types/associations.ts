export interface Associations {
    items: Association[];
}

export interface Association {
    id: string;
    userId: string;
    userEmail: string;
    companyNumber: string;
    companyName: string;
}
