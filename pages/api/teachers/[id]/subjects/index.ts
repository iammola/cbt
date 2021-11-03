import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { TeacherModel } from "db/models";

import type { RouteResponse } from "types";

async function getTeacherSubjects(id: string, select: string): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const data = await TeacherModel.findById(id).select('-_id subjects').lean();

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
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
