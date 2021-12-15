import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ResultModel } from "db/models";

import type { ServerResponse } from "types";
import type { StudentResultSubjectGETData, StudentResultSubjectPOSTData } from "types/api/students";

async function getStudentSubjectResult(student: any, subject: any): Promise<ServerResponse<StudentResultSubjectGETData>> {
    await connect();
    let [success, status, message]: ServerResponse<StudentResultSubjectGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const result = await ResultModel.findOne({
            student,
            "data.subject": subject
        }, "data.total data.scores.$").lean();

        [success, status, message] = [true, StatusCodes.OK, {
            data: result?.data[0] ?? {},
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

async function updateStudentSubjectResult(student: any, subject: any, { scores, total }: any): Promise<ServerResponse<StudentResultSubjectPOSTData>> {
    await connect();
    let [success, status, message]: ServerResponse<StudentResultSubjectPOSTData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const record = await ResultModel.findOne({
            student,
            "data.subject": subject
        }, '_id').lean();

        const [filter, update, options] = record === null ? [
            { student }, {
                $push: { data: { scores, subject, total } }
            }, { upsert: true }
        ] : [
            { _id: record._id }, {
                $set: {
                    "data.$[i].total": total,
                    "data.$[i].scores": scores
                }
            }, {
                runValidators: true, fields: '_id',
                arrayFilters: [{ "i.subject": subject }]
            }
        ];

        [success, status, message] = [true, StatusCodes.OK, {
            data: { ok: (await ResultModel.updateOne(filter, update, options)).acknowledged },
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

export default async function handler({ body, method, query }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<StudentResultSubjectGETData | StudentResultSubjectPOSTData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = ["GET", "POST"];

    if (allowedMethods.includes(method ?? '') === false) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await (method === "POST" ? updateStudentSubjectResult(query.id, query.subjectId, JSON.parse(body)) : getStudentSubjectResult(query.id, query.subjectId));

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
