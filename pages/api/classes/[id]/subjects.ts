import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, SubjectsModel } from "db/models";

import type { ServerResponse, SubjectRecord } from "types";

async function getSubjects(id: any, select: string): Promise<ServerResponse> {
    await connect();
    let [success, status, message]: ServerResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const data = await SubjectsModel.findOne({ class: id }, { _id: 0, class: 0 });
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

async function createSubject(id: any, { name, alias }: SubjectRecord): Promise<ServerResponse> {
    await connect();
    let [success, status, message]: ServerResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const data = await SubjectsModel.findOneAndUpdate({ class: id }, {
            $push: { subjects: { name, alias } }
        }, { runValidators: true, returnDocument: "after", upsert: await ClassModel.exists({ _id: id }) }).lean();

        if (data === null) throw new Error('Class does not exist');

        [success, status, message] = [true, StatusCodes.CREATED, {
            data: { name, alias },
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
    const { id, select } = query as { id: string; select: string };
    let [success, status, message]: ServerResponse = [false, StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? createSubject(id, JSON.parse(body)) : getSubjects(id, select))

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
