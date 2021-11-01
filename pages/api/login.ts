import { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { StudentModel, TeacherModel } from "db/models";

import { RouteResponse } from "types";

async function findUser(model: typeof TeacherModel | typeof StudentModel, access: "Mola" | "Teacher" | "Student", code: string) {
    const data = await model.findOne({ code }).select('name email').lean();
    if (data === null) throw new Error('User does not exist');

    return { ...data, access };
}

export default async function handler({ body, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "POST";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else {
        const { code }: { code: string } = JSON.parse(body);

        try {
            const db = await connect();
            console.log(db.connection.readyState);
            const data = await Promise.any([findUser(TeacherModel, "Teacher", code)/* , findUser(StudentModel, "Student", code) */]);
            console.log(data.access);

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
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
