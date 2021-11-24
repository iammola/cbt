import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { EventModel } from "db/models";

import type { RouteResponse } from "types";

async function createEvent({ date, event }: { date: Date; event: { name: string; subject: string } }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        let data = await EventModel.findOneAndUpdate({ date }, {
            $push: { events: event }
        }, { runValidators: true }).select('date -_id').lean();

        if (data === null) data = await EventModel.create({
            date,
            events: [event]
        });

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

async function getEvents({ from, to, exact }: { from: string; to: string; exact?: string; }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const data = await EventModel.find({ date: exact !== undefined ? new Date(exact) : { $gte: new Date(+from), $lte: new Date(+to) } }).lean();
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

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? createEvent(JSON.parse(body)) : getEvents(query as any));

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
