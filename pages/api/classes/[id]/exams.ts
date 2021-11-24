import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, SubjectsModel } from "db/models";

import type { RouteResponse } from "types";

async function getExams(classId: any): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const data = await SubjectsModel.findOne({ class: classId }, '-subjects.teachers').lean();
        if (data === null) throw new Error('Class does not exist');

        const examsRecord = await ExamModel.find({ subjectId: data.subjects.map(({ _id }) => _id) }, '-_id subjectId').lean();
        const exams = examsRecord.map(({ subjectId }) => data.subjects.find(({ _id }) => _id.equals(subjectId)));

        [success, status, message] = [true, StatusCodes.OK, {
            data: { exams },
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

export default async function handler({ query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getExams(query.id);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
