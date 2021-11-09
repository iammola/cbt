import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { AnswersModel, ClassModel, ExamModel, QuestionsModel, SubjectsModel } from "db/models";

import type { RouteResponse } from "types";

export default async function handler({ method }: NextApiRequest, res: NextApiResponse) {
async function getExam(_id: any, loggedInUser: any): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const exam = await ExamModel.findById(_id).lean();
        if (exam === null) throw new Error("Exam ID not found");
        if (loggedInUser !== exam.created.by.toString()) throw new Error("Unauthorized to access");

        const { duration, instructions, SubjectID } = exam;

        const classSubjects = await SubjectsModel.findOne({ "subjects._id": exam.SubjectID }, "-_id class subjects._id subjects.name").lean();
        const examClass = await ClassModel.findById(classSubjects?.class, 'name').lean();

        const examQuestions = await QuestionsModel.findOne({ exam: (exam as any)._id }, '-_id questions').lean();

        [success, status, message] = [true, StatusCodes.OK, {
            data: {
                _id, instructions,
                questions: await Promise.all(examQuestions?.questions.map(async item => ({
                    ...item,
                    answers: await AnswersModel.find({ questions: (item as any)._id }, '-_id answers').lean(),
                })) ?? []),
                exam: {
                    class: examClass?.name ?? '',
                    subject: classSubjects?.subjects.find(({ _id }: any) => _id.equals(SubjectID))?.name ?? '',
                    details: { duration, SubjectID }
                }
            },
            message: ReasonPhrases.OK
        }];
    } catch (error: any) {
        [status, message] = [StatusCodes.INTERNAL_SERVER_ERROR, {
            error: error.message,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }]
    }

    return [success, status, message];
}

    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
