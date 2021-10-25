import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { ClassModel } from "db/models/Class";
import { SubjectModel } from "db/models/Subject";

type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];

async function createSubject(id: string, subjectData: typeof SubjectModel.schema.obj): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const data = await SubjectModel.create(subjectData);
        [success, status, message] = [true, 201, { data, message: "Created" }];
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't CREATE subject" }];
    }

    return [success, status, message];
}

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
