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

        const score = exam.questions.map(({ _id, answers }) => answers.find(e => e.isCorrect)?._id?.equals(result.answers[_id.toString()] ?? '') === true ? 1 : 0).reduce((a: number, b) => a + b, 0);

        await ResultModel.findOneAndUpdate({ student: id }, {
            $push: {
                results: {
                    ...result,
                    score, ended: new Date()
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
