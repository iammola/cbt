import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { generateCode } from "utils";

import { connect } from "db";
import { SessionModel, StudentModel } from "db/models";

import type { StudentRecord, ServerResponse } from "types";
import { StudentsPOSTData } from "types/api/students";

async function createStudent({ academic, ...student }: Pick<StudentRecord, 'email' | 'name'> & { academic: { class: string; subject: string; } }): Promise<ServerResponse<StudentsPOSTData>> {
    await connect();
    let [success, status, message]: ServerResponse<StudentsPOSTData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const currentSession = await SessionModel.findOne({ current: true, "terms.current": true }, 'terms').lean();

        const { code, ...data } = await StudentModel.create({
            ...student,
            code: generateCode(),
            academic: currentSession === null ? [] : [{
                session: currentSession._id,
                terms: [{
                    ...academic,
                    term: currentSession.terms[0]._id
                }]
            }]
        });
        [success, status, message] = [true, StatusCodes.CREATED, {
            data: { code },
            message: ReasonPhrases.CREATED
        }];
    } catch (error: any) {
        [status, message] = [StatusCodes.BAD_REQUEST, {
            error: error.message,
            message: ReasonPhrases.BAD_REQUEST
        }];
    }

    return [success, status, message];
}

export default async function handler({ method, body }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<StudentsPOSTData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? createStudent(JSON.parse(body)) : [success, status, message]);

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
