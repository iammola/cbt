import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { StudentModel } from "db/models/Student";
import { TeacherModel } from "db/models/Teacher";

type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];

async function findUser(model: typeof TeacherModel | typeof StudentModel, code: string) {
    await connect();
    const data = await model.findOne({ code }).select('name email').lean();
    if (data === null) throw new Error('User does not exist');

    return data;
}

export default async function handler({ body, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = "POST";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    } else {
        const { code }: { code: string } = JSON.parse(body);
        try {
            const data = await Promise.any([findUser(TeacherModel, code), findUser(StudentModel, code)]);
            [success, status, message] = [true, 200, { data, message: "Success" }];
        } catch (error) {
            if (error instanceof AggregateError === true) [status, message] = [400, "Failed"];
            else[status, message] = [403, "Forbidden"];
        }
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
