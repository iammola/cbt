import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, SubjectModel } from "db/models";

import type { RouteResponse } from "types";

async function getExtendedTeacherSubjects(id: any, select: string): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const subjects = await SubjectModel.find({ "subjects.teachers": id }, "-_id").lean();
        const classes = await ClassModel.find({ _id: subjects.map(item => item.class) }, 'name').lean();

        const data = classes.map(({ _id, name }) => ({
            name,
            subjects: subjects.find(item => _id.equals(item.class))?.subjects.filter(({ teachers }) => teachers.find(teacher => _id.equals(teacher))) ?? [],
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

export default async function handler({ query, method }: NextApiRequest, res: NextApiResponse) {
    const { id, select } = query as { [K in "id" | "select"]: string; };
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getExtendedTeacherSubjects(id, select)

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
