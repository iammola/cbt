import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { EventModel } from "db/models";

import { RouteResponse } from "types";

async function getEvents({ from, to, exact }: { from: string; to: string; exact?: string; }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 400, ""];

    try {
        const data = await EventModel.find({ date: exact !== undefined ? new Date(exact) : { $gte: new Date(+from), $lte: new Date(+to) } }).lean();
        [success, status, message] = [true, 200, { data, message: "Success" }];
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't GET events" }];
    }

    return [success, status, message];
}

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
