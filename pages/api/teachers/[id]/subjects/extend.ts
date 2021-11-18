import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, SubjectsModel } from "db/models";

import type { RouteResponse } from "types";

async function getExtendedTeacherSubjects(id: any): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const subjects: SubjectsRecord<true>[] = await SubjectsModel.find({ "subjects.teachers": id }, "-_id").populate('class', 'name').lean();

        [success, status, message] = [true, StatusCodes.OK, {
            data: subjects.map(cur => ({
                name: cur.class.name,
                subjects: cur.subjects.filter(({ teachers }) => teachers.find(teacher => teacher.equals(id))).map(({ teachers, ...item }) => item)
            })),
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
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getExtendedTeacherSubjects(query.id)

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
