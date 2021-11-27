import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { EventsRangeGETData } from "types/api/events";
import type { EventRecord, ServerResponse, SubjectsRecord } from "types";

export default async function handler({ query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<EventsRangeGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    }

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
