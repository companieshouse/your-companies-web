import { AnyRecord } from "./util-types";

export interface PageItem {
    number?: number;
    href?: string;
    current?: boolean;
    ellipsis?: boolean;
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
}
