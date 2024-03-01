export type AnyRecord = Record<string, unknown>;

export type ViewData = {
    lang: AnyRecord;
    errors?:
    | {
        [key: string]: {
            text: string;
        };
    };
    companyNumber?: string;
    companyName?: string;
    backLinkHref?: string;
    [key: string]: unknown
};

export type CompanyNameAndNumber = {
    companyName: string;
    companyNumber: string;
}
