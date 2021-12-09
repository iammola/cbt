import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { ServerResponse } from "types";
import type { StudentResultSubjectGETData, StudentResultSubjectPOSTData } from "types/api/students";

export default async function handler({ method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<StudentResultSubjectGETData | StudentResultSubjectPOSTData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["GET", "POST"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    }

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
