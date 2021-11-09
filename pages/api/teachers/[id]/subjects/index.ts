import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SubjectsModel, TeacherModel } from "db/models";

import type { RouteResponse } from "types";

async function getTeacherSubjects(id: string): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const subjects = await SubjectsModel.find({ "subjects.teacher": id }, '-class').lean();
        const data = subjects.map(({ subjects }) => subjects.filter(({ teachers }) => teachers.find(teacher => teacher.toString() === id)).map(item => (item as any)._id)).flat();

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
    const { id } = query as { id: string };
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getTeacherSubjects(id);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
