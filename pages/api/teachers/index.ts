import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { generateCode } from "utils";

import { connect } from "db";
import { SubjectModel, TeacherModel } from "db/models";

import type { TeacherRecord, RouteResponse } from "types";

async function createTeacher({ subjects, ...teacher }: TeacherRecord & { subjects: { [key: string]: string[] } }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const data = await TeacherModel.create({
            ...teacher,
            code: generateCode()
        });

        Object.entries(subjects).map(async ([classID, subjects]) => await SubjectModel.updateOne({
            class: classID as any,
        }, {
            $addToSet: { "subjects.$[i].teachers": data._id }
        }, {
            runValidators: true,
            arrayFilters: [{
                "subjects.i._id": subjects
            }]
        }).lean());

        [success, status, message] = [true, StatusCodes.CREATED, {
            data,
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

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? createTeacher(JSON.parse(body)) : [success, status, message]);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
