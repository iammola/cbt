import { startSession } from "mongoose";
import { minutesToMilliseconds } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { AnswerModel } from "db/models/Answer";
import { QuestionModel } from "db/models/Question";
import { ExamModel, ExamRecord } from "db/models/Exam";

import { RawQuestion } from "pages/create/questions";

type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];

async function createExam({ exam: { duration, ...exam }, questions }: { exam: Omit<ExamRecord, 'questions'>; questions: RawQuestion[] }): Promise<RouteResponse> {
    await connect();
    const session = await startSession();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const data = await session.withTransaction(async () => await ExamModel.create([{
            ...exam,
            duration: minutesToMilliseconds(duration),
            questions: (await QuestionModel.create(await Promise.all(questions.map(async ({ answers, ...question }) => ({
                ...question,
                answers: (await AnswerModel.create(answers, { session })).map(({ _id }) => _id)
            }))), { session })).map(({ _id }) => _id)
        }], { session }));

        [success, status, message] = [true, 201, { data, message: "Success" }];
    } catch (error) {
        
        [status, message] = [400, { error, message: "Couldn't CREATE Exam" }];
    }

    session.endSession();

    return [success, status, message];
}

export default async function handler({ body, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    } else [success, status, message] = method === "POST" ? await createExam(JSON.parse(body)) : [false, status, message];

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}