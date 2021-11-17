import { minutesToMilliseconds } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel } from "db/models";

import type { ExamRecord, RouteResponse } from "types";

type RequestBody = {
    exam: ExamRecord;
    questions: any[];
}

async function updateExam(_id: any, by: any, { exam: { duration, ...exam }, questions }: RequestBody): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        await ExamModel.updateOne({ _id }, {
            ...exam, questions,
            duration: minutesToMilliseconds(duration),
            $push: { edited: { by, at: new Date() } },
        }, { runValidators: true });

        [success, status, message] = [true, StatusCodes.OK, {
            data: _id,
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

export default async function handler({ body, cookies, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["GET", "PUT"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "PUT" ? updateExam(query.id, JSON.parse(cookies.account)._id, JSON.parse(body)) : [success, status, message])

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
