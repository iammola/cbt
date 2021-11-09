import { startSession } from "mongoose";
import { minutesToMilliseconds } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, EventModel, AnswersModel, QuestionsModel } from "db/models";

import type { RouteResponse, ExamRecord, CreateQuestion } from "types";

async function getExams({ select = '', date }: { select: string; date: string }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const eventRecords = await EventModel.findOne({ date: new Date(+date) }).select('events').lean() ?? { events: [] };
        const data = await ExamModel.find({ SubjectID: eventRecords.events.map(({ subject }) => subject) }).select(select).lean();
        [success, status, message] = [true, StatusCodes.OK, {
            data: data.map(({ questions, ...item }) => ({ ...item, questions: questions.length })),
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

async function createExam({ exam: { duration, SubjectID, instructions }, questions }: { exam: Omit<ExamRecord, 'questions'>; questions: CreateQuestion[] }, by: string): Promise<RouteResponse> {
    await connect();
    const session = await startSession();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        if (await ExamModel.exists({ SubjectID })) throw new Error("Subject Exam already created");

        const data = await session.withTransaction(async () => {
            const [{ _id }] = await ExamModel.create([{
                SubjectID,
                instructions,
                created: { by, at: new Date() },
                duration: minutesToMilliseconds(duration),
            }], { session });

            const [items] = await QuestionsModel.create([{
                exam: _id,
                questions: questions.map(({ answers, ...question }) => question)
            }], { session });

            await AnswersModel.create(items.questions.map(({ _id }: any, i) => ({
                question: _id,
                answers: questions[i].answers
            })), { session });

            return _id;
        });

        [success, status, message] = [true, StatusCodes.CREATED, {
            data,
            message: ReasonPhrases.CREATED
        }];
    } catch (error: any) {
        [status, message] = [StatusCodes.BAD_REQUEST, {
            error: error.message,
            message: ReasonPhrases.BAD_REQUEST
        }];
    }

    session.endSession();

    return [success, status, message];
}

export default async function handler({ body, query, method, cookies }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? createExam(JSON.parse(body), JSON.parse(cookies.account)._id) : getExams(query as any));

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
