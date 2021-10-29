import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { SessionModel } from "db/models";

import { SessionRecord, RouteResponse } from "types";

async function createSession(session: SessionRecord): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        if (session.current === true) await SessionModel.updateMany({ current: true }, {
            current: false,
            $set: { "terms.$[i].current": false }
        }, {
            runValidators: true,
            arrayFilters: [{ "i.current": true }]
        });
        const data = await SessionModel.create(session);
        [success, status, message] = [true, 201, { data, message: "Created" }];
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't CREATE Session" }];
    }

    return [success, status, message];
}

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    } else[success, status, message] = await (method === "POST" ? createSession(JSON.parse(body)) : [success, status, message]);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
