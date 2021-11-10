import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, QuestionsModel, SubjectsModel } from "db/models";

import type { RouteResponse } from "types";

async function getExams(id: any): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const exam = await ExamModel.find({ "created.by": id }, '-instructions').populate('created.by').lean();

        const subjects = await SubjectsModel.find({ "subjects._id": exam.map(({ SubjectID }) => SubjectID) }, '-_id class subjects._id subjects.name').populate('class', 'name').lean();

            const questions =  (await QuestionsModel.findOne({ exam: _id }, '-_id questions._id').lean())?.questions.length;
        const data = await Promise.all(exam.map(async ({ _id, SubjectID, duration, created }: any) => {
            const item = subjects.find(({ subjects }) => subjects.find(({ _id }: any) => _id.equals(SubjectID)));

            return {
                _id,
                ...exam,
                questions,
                class: item?.class,
                subject: item?.subjects.find(({ _id }: any) => _id.equals(SubjectID))?.name,
            };
        }));

        [success, status, message] = [true, StatusCodes.OK, {
            data,
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

export default async function handler({ method, query }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getExams(query.id);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
