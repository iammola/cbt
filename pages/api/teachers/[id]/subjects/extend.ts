import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, TeacherModel } from "db/models";

import type { RouteResponse } from "types";

async function getExtendedTeacherSubjects(id: string, select: string): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const teacher = await TeacherModel.findById(id).populate('subjects', select).select('-_id subjects').lean();
        const classes = await ClassModel.find({}, {
            _id: 0, name: 1,
            subjects: teacher?.subjects.map(({ _id }) => _id) ?? []
        }).lean();

        const data = classes.map(({ name, ...item }) => ({
            name,
            subjects: item.subjects.map(subject => teacher?.subjects.find(({ _id }) => _id.equals(subject)))
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

export default async function handler({ method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
