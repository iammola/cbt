import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel, StudentModel } from "db/models";

import { StudentRecord, RouteResponse } from "types";

async function createStudent({ academic, ...student }: Pick<StudentRecord, 'email' | 'name'> & { academic: { class: string; subject: string; } }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const currentSession = await SessionModel.findOne({ current: true, "terms.current": true }).select('terms');

        const data = await StudentModel.create({
            ...student,
            academic: currentSession === null ? [] : [{
                session: currentSession._id,
                terms: [{
                    ...academic,
                    term: (currentSession.terms[0] as any)._id
                }]
            }]
        });
        [success, status, message] = [true, StatusCodes.CREATED, {
            data,
            message: ReasonPhrases.CREATED
        }];
    } catch (error) {
        [status, message] = [StatusCodes.BAD_REQUEST, {
            error,
            message: ReasonPhrases.BAD_REQUEST
        }];
    }

    return [success, status, message];
}

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? createStudent(JSON.parse(body)) : [success, status, message]);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
