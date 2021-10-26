import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { ClassModel } from "db/models/Class";
import { SubjectModel } from "db/models/Subject";

type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];

async function getSubjects(id: string, select: string): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const data = await ClassModel.findById(id).populate('subjects').select(`-_id subjects`);
        [success, status, message] = [true, 201, { data, message: "Created" }];
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't GET subjects" }];
    }

    return [success, status, message];
}

async function createSubject(id: string, subjectData: typeof SubjectModel.schema.obj): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        if (await ClassModel.exists({ _id: id }) === true) {
            const data = await SubjectModel.create(subjectData);
            await ClassModel.findByIdAndUpdate(id, {
                $addToSet: { subjects: data._id }
            }, { runValidators: true });

            [success, status, message] = [true, 201, { data, message: "Created" }];
        } else[success, status, message] = [false, 400, "Class does not exist"];
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't CREATE subject" }];
    }

    return [success, status, message];
}

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
    const { id } = query as { id: string };
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = ["POST", "GET"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    } else[success, status, message] = await (method === "POST" ? createSubject(id, JSON.parse(body)) : [success, status, message])

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
