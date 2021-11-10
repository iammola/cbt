import { startSession } from "mongoose";
import { minutesToMilliseconds } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { AnswersModel, ExamModel, QuestionsModel } from "db/models";

import type { CreateQuestion, ExamRecord, RouteResponse } from "types";

type RequestBody = {
    exam: ExamRecord;
    questions: CreateQuestion<true>[];
    original: {
        _id: string;
        answers: string[];
    }[];
}

async function updateExam(id: any, { exam: { duration, SubjectID, instructions }, questions, original }: RequestBody): Promise<RouteResponse> {
    await connect();
    const session = await startSession();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const check = (_id: string, arr: { _id: string; }[] = original) => arr.find(item => item._id === _id);
        const updates = questions.filter(({ _id }) => check(_id));
        const deletes = original.filter(({ _id }) => !check(_id, questions));

        const opts = {
            session,
            runValidators: true,
            returnDocument: 'after'
        };

        session.withTransaction(async () => {
            const [, updatedQuestions] = await Promise.all([
                ExamModel.findByIdAndUpdate(id, {
                    SubjectID,
                    instructions,
                    duration: minutesToMilliseconds(duration),
                }, opts),
                QuestionsModel.findOneAndUpdate({ exam: id }, {
                    questions: questions.map(({ answers, ...question }) => question)
                }, opts).lean(),
                Promise.all(updates.map(async ({ _id, answers }) =>
                    await AnswersModel.findOneAndUpdate({ question: _id as unknown as undefined }, { answers }, opts).lean()
                )),
                Promise.all(deletes.map(async ({ _id }) =>
                    await AnswersModel.findOneAndDelete({ question: _id as unknown as undefined }, opts).lean()
                ))
            ]);

            const creates = updatedQuestions?.questions.map(({ _id }: any, i) => check(_id.toString()) === undefined ? {
                question: _id,
                answers: questions[i].answers
            } : 0).filter(Boolean) ?? [];

            await AnswersModel.create(creates, opts);

            console.log(creates);
        });

        [success, status, message] = [true, StatusCodes.OK, {
            data: id,
            updates, deletes,
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

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["GET", "PUT"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "PUT" ? updateExam(query.id, JSON.parse(body)) : [success, status, message])

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
