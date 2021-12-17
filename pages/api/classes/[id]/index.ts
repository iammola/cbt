import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel } from "db/models";

import type { ServerResponse } from "types";
import type { ClassGETData } from "types/api/classes";

async function getClass(id: any, select: any): Promise<ServerResponse<ClassGETData>> {
    await connect();
    let [success, status, message]: ServerResponse<ClassGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const data = await ClassModel.findById(id, select).lean();

        [success, status, message] = [true, StatusCodes.OK, {
            data,
            message: ReasonPhrases.OK
        }];
    } catch (error: any) {
        [status, message] = [StatusCodes.BAD_REQUEST, {
            error: error.message,
            message: ReasonPhrases.BAD_REQUEST
        }];
    }

    return [success, status, message];
}

export default async function handler({ method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<ClassGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    }

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
