import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, ResultModel, StudentModel } from "db/models";

import type { ResultRecord, ServerResponse } from "types";
import type { StudentResultPOSTData } from "types/api/students";

type RequestBody = Omit<ResultRecord['results'][number], 'score' | 'ended' | 'answers'> & { answers: { [key: string]: string } }

async function createResult(id: any, result: RequestBody): Promise<ServerResponse<StudentResultPOSTData>> {
    await connect();
    let [success, status, message]: ServerResponse<StudentResultPOSTData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        if (await StudentModel.exists({ _id: id }) === false) throw new Error("Student does not exist");
        const exam = await ExamModel.findById(result.examId, '-_id questions._id questions.answers._id questions.answers.isCorrect').lean();
        if (exam === null) throw new Error("Exam does not exist");

        const items = exam.questions.map(({ _id, answers }) => {
            const answer = result.answers[_id.toString()];
            return {
                _id, answer,
                score: +(answers.find(e => e.isCorrect)?._id?.equals(answer) ?? 0)
            };
        }).filter(i => i.answer);

        const score = items.reduce((a, b) => a + b.score, 0);

        await ResultModel.findOneAndUpdate({ student: id }, {
            $push: {
                results: {
                    ...result,
                    score, ended: new Date(),
                    answers: items.reduce((a: any[], b) => [...a, {
                        question: b._id,
                        answer: b.answer,
                    }], [])
                }
            }
        }, {
            lean: true, returnDocument: 'after',
            fields: 'student', upsert: true, runValidators: true,
        });

        [success, status, message] = [true, StatusCodes.CREATED, {
            data: { score },
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

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<StudentResultPOSTData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "POST";

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await createResult(query.id, JSON.parse(body));

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
