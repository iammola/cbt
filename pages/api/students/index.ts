import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { SessionModel } from "db/models/Session";
import { StudentModel, StudentRecord } from "db/models/Student";

type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];

async function createStudent({ academic, ...student }: Pick<StudentRecord, 'email' | 'name'> & { academic: { class: string; subject: string; } }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const currentSession = await SessionModel.findOne({ current: true, "terms.current": true }).select('terms');

        const data = await StudentModel.create({
            ...student,
            academic: currentSession === null ? [] : [{
                session: currentSession._id,
                terms: [{
                    ...academic,
                    term: (currentSession.terms[0] as any)._id
                }]
            }]
        });
        [success, status, message] = [true, 201, { data, message: "Created" }];
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't CREATE Class" }];
    }

    return [success, status, message];
}

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    } else[success, status, message] = await (method === "POST" ? createStudent(JSON.parse(body)) : [success, status, message]);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
