import { Headers } from "@companieshouse/api-sdk-node/dist/http";

export const extractRequestIdHeader = (requestId?: string): Headers => {
    if (!requestId) return {};
    const id = String(requestId).trim();
    return id ? { "x-request-id": id } : {};
};
