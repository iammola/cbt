import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, EventModel, SessionModel, StudentModel } from "db/models";

import type { RouteResponse } from "types";

async function getSchedule({ id, date }: { id: string, date: string }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const currentSession = await SessionModel.findOne({ current: true }, { terms: { $elemMatch: { current: true } } }).lean();

        if (currentSession !== null) {
            const currentStudent = await StudentModel.findById(id, { academic: { $elemMatch: { terms: { $elemMatch: { term: (currentSession.terms[0] as any)._id } } } } }).lean();

            if (currentStudent !== null) {
                const subjects = currentStudent?.academic[0].terms[0].subjects;
                const events = await EventModel.findOne({
                    date: new Date(+date),
                    events: { $elemMatch: { subject: subjects } }
                }).select('events').lean();

                const data = (await ExamModel.find({ SubjectID: subjects }).select('-_id').lean()).map(async ({ _id, duration, questions, SubjectID }: any) => ({
                    time: duration,
                    questions: questions.length,
                    name: events?.events.find(event => event.subject === SubjectID)?.name ?? ''
                }));

                [success, status, message] = [true, StatusCodes.CREATED, {
                    data,
                    message: ReasonPhrases.CREATED
                }];
            } else[success, status, message] = [false, StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST];
        }
    } catch (error: any) {
        [status, message] = [StatusCodes.BAD_REQUEST, {
            error: error.message,
            message: ReasonPhrases.BAD_REQUEST
        }];
    }

    return [success, status, message];
}

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getSchedule(query as { id: string, date: string });

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
