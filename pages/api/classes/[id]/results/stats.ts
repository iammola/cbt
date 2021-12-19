import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ResultModel, SessionModel, StudentModel } from "db/models";

import type { ServerResponse } from "types";
import type { ClassResultGETData } from "types/api/classes";

async function getClassResultStats(id: any): Promise<ServerResponse<ClassResultGETData>> {
    await connect();
    let [success, status, message]: ServerResponse<ClassResultGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const currentSession = await SessionModel.findOne({ current: true, "terms.current": true }, 'terms._id.$').lean();
        if (currentSession === null) throw new Error("Current Session Error");

        const students = await StudentModel.find({
            academic: {
                $elemMatch: {
                    "terms.class": id,
                    session: currentSession._id,
                    "terms.term": currentSession.terms[0]._id,
                }
            }
        }, '_id').lean();

        const results = await ResultModel.find({ student: { $in: students.map(i => i._id) } }).lean();

        const scores = results.map(({ data }) => {
            const total = data.reduce((acc, entry) => acc + (entry.total ?? entry.scores?.reduce((acc, item) => acc + item.score, 0) ?? 0), 0);

            return {
                total,
                average: total / ((data?.length ?? 1) * 1e2) * 1e2
            };
        });

        const totals = scores.map(item => item.total);
        const averages = scores.map(item => item.average);

        [success, status, message] = [true, StatusCodes.OK, {
            data: {
                highest: Math.max(...totals),
                lowest: Math.min(...totals),
                average: {
                    lowest: Math.min(...averages),
                    highest: Math.max(...averages),
                    class: averages.reduce((a, b) => a + b, 0) / averages.length
                }
            }, message: ReasonPhrases.OK
        }];
    } catch (error: any) {
        [status, message] = [StatusCodes.BAD_REQUEST, {
            error: error.message,
            message: ReasonPhrases.BAD_REQUEST
        }];
    }

    return [success, status, message];
}

export default async function handler({ method, query }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<ClassResultGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getClassResultStats(query.id);

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
