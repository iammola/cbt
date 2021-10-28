import { startSession } from "mongoose";
import { minutesToMilliseconds } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { EventModel } from "db/models/Event";
import { AnswerModel } from "db/models/Answer";
import { QuestionModel } from "db/models/Question";
import { ExamModel, ExamRecord } from "db/models/Exam";

import { RawQuestion } from "pages/create/exam";

type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];

async function getExams({ select = '', date }: { select: string; date: string }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const eventRecords = await EventModel.findOne({ date: new Date(+date) }).select('events').lean() ?? { events: [] };
        const data = await ExamModel.find({ SubjectID: { $in: eventRecords.events.map(({ subject }) => subject) } }).select(select).lean();
        [success, status, message] = [true, 200, {
            data: data.map(({ questions, ...item }) => ({ ...item, questions: questions.length })),
            message: "Success"
        }];
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't GET exams" }];
    }

    return [success, status, message];
}

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

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    } else[success, status, message] = await (method === "POST" ? createExam(JSON.parse(body)) : [success, status, message]);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
