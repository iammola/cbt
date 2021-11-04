import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, SubjectModel } from "db/models";

import type { RouteResponse, SubjectRecord } from "types";

async function getSubjects(id: string, select: string): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const data = await ClassModel.findById(id).populate('subjects', select).select(`-_id subjects`);
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

async function createSubject(id: string, subject: SubjectRecord): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        if (await ClassModel.exists({ _id: id }) === true) {
            const data = await SubjectModel.create(subject);
            await ClassModel.findByIdAndUpdate(id, {
                $addToSet: { subjects: data._id }
            }, { runValidators: true });

            [success, status, message] = [true, StatusCodes.CREATED, {
                data,
                message: ReasonPhrases.CREATED
            }];
        } else throw new Error('Class does not exist');
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
    let [success, status, message]: RouteResponse = [false, StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? createSubject(id, JSON.parse(body)) : getSubjects(id, select))

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
