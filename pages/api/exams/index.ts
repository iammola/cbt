import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, EventModel } from "db/models";

import type { ServerResponse, ExamRecord, CreateQuestion } from "types";

async function createExam({ exam: { subjectId, ...exam }, questions }: { exam: ExamRecord; questions: CreateQuestion[] }, by: string): Promise<ServerResponse> {
    await connect();
    let [success, status, message]: ServerResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        if (await ExamModel.exists({ subjectId })) throw new Error("Subject Exam already created");

        await ExamModel.create({
            ...exam, subjectId, questions,
            created: { by, at: new Date() },
        });

        [success, status, message] = [true, StatusCodes.CREATED, {
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

export default async function handler({ body, query, method, cookies }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "POST";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await createExam(JSON.parse(body), JSON.parse(cookies.account)._id);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
