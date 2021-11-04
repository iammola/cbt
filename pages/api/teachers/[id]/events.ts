import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, EventModel, TeacherModel } from "db/models";

import type { RouteResponse } from "types";

export default async function handler({ method }: NextApiRequest, res: NextApiResponse) {
async function getTeacherEvents(id: string): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const teacher = await TeacherModel.findById(id, '-_id subjects').lean();
        const classes = await ClassModel.find({}, {
            name: 1,
            subjects: teacher?.subjects.map(({ _id }) => _id) ?? []
        }).lean();

        const events = await EventModel.find({ date: { $gte: new Date() } }, {
            date: 1,
            events: {
                $elemMatch: { subject: teacher?.subjects }
            }
        }).lean();

        const data = events.reduce((acc, { events, date }) => [...acc, ...events.map(({ name, subject }) => ({
            name, date,
            class: classes.find(({ subjects }) => subjects.find(i => i.equals(subject)))?.name ?? ''
        }))], [] as { name: string; date: Date; class: string; }[]);

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

    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
