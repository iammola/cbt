import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { CBTResultModel, ExamModel } from "db/models";

import type { CBTResultRecord, ServerResponse } from "types";
import type { TeacherCBTResultsGETData } from "types/api/teachers";

async function getCBTResults(id: any, exam: any): Promise<ServerResponse<TeacherCBTResultsGETData>> {
    await connect();
    let [success, status, message]: ServerResponse<TeacherCBTResultsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const j = await ExamModel.findOne({ _id: exam, "created.by": id }, 'subjectId').lean();
        const data: Pick<CBTResultRecord<true>, 'student' | 'results'>[] = await CBTResultModel.find({ "results.examId": exam }, 'student results.started.$ results.score').populate('student', 'name').lean();

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
    let [success, status, message]: ServerResponse<TeacherCBTResultsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getCBTResults(query.id, query.examId);

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
