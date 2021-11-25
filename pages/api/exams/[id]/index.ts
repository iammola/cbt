import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, SubjectsModel } from "db/models";

import type { ExamData, SubjectsRecord, ServerResponse } from "types";

async function updateExam(_id: any, by: any, { exam, questions }: { exam: any; questions: any; }): Promise<ServerResponse> {
    await connect();
    let [success, status, message]: ServerResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        await ExamModel.updateOne({ _id }, {
            ...exam, questions,
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

async function getExam(_id: any): Promise<ServerResponse> {
    await connect();
    let [success, status, message]: ServerResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const exam = await ExamModel.findById(_id, '-created -edited').lean();
        if (exam === null) throw new Error("Exam ID not found");

        const { duration, instructions, questions, subjectId } = exam;

        const subject: SubjectsRecord<true> = await SubjectsModel.findOne({
            "subjects._id": subjectId
        }, "class subjects.name.$").populate("class", "-_id name").lean();

        if (subject === null) throw new Error("Exam Subject not found");

        [success, status, message] = [true, StatusCodes.OK, {
            data: {
                _id, questions,
                details: {
                    duration, subjectId, instructions,
                    name: {
                        class: subject.class.name,
                        subject: subject?.subjects[0].name
                    },
                }
            } as ExamData,
            message: ReasonPhrases.OK,
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
    let [success, status, message]: ServerResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["GET", "PUT"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "PUT" ? updateExam(query.id, JSON.parse(cookies.account)._id, JSON.parse(body)) : getExam(query.id))

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
