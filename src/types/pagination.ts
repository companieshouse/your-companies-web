import { AnyRecord } from "./utilTypes";

export interface PageItem {
    number?: number;
    href?: string;
    current?: boolean;
    ellipsis?: boolean;
    visuallyHiddenText?: string;
}

export interface PaginationPreviousNext {
    attributes?: AnyRecord;
    html?: string;
    text?: string;
    href: string;
}

export interface PaginationData {
    previous?: PaginationPreviousNext;
    next?: PaginationPreviousNext;
    items: PageItem[];
    landmarkLabel: string;
}

export interface Pagination {
    pagination: PaginationData | undefined;
    pageNumber: number;
    numberOfPages: number;
}
