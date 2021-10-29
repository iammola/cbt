import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { SubjectModel, TeacherModel } from "db/models";

type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];

async function createTeacher({ subjects, ...teacher }: TeacherRecord): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const data = await TeacherModel.create({
            ...teacher,
            subjects: (await SubjectModel.find({ _id: { $in: subjects } }).select('_id').lean()).map(({ _id }: any) => _id)
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
    } else[success, status, message] = await (method === "POST" ? createTeacher(JSON.parse(body)) : [success, status, message]);

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
