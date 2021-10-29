import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { ExamModel, EventModel, SessionModel, StudentModel } from "db/models";

import { RouteResponse } from "types";

async function getSchedule({ id, date }: { id: string, date: string }): Promise<RouteResponse> {
    await connect();
    let [success, status, message]: RouteResponse = [false, 501, ""];

    try {
        const currentSession = await SessionModel.findOne({ current: true, terms: { $elemMatch: { current: true } } }).select('-_id terms._id').lean();

        if (currentSession !== null) {
            const currentStudent = await StudentModel.findById(id).select({
                academic: { $elemMatch: { terms: { $elemMatch: { term: (currentSession.terms[0] as any)._id } } } }
            }).lean();

            if (currentStudent !== null) {
                const subjects = currentStudent?.academic[0].terms[0].subjects;
                const events = await EventModel.findOne({
                    date: new Date(+date),
                    events: { $elemMatch: { subject: subjects } }
                }).select('events').lean();

                const data = (await ExamModel.find({ SubjectID: subjects }).select('-_id').lean()).map(({ duration, questions, SubjectID }) => ({
                    time: duration,
                    questions: questions.length,
                    name: events?.events.find(event => event.subject === SubjectID)?.name ?? ''
                }));

                [success, status, message] = [true, 200, { data, message: "Success" }];
            } else[success, status, message] = [false, 400, "Invalid ID"];
        }
    } catch (error) {
        [status, message] = [400, { error, message: "Couldn't GET Session" }];
    }

    return [success, status, message];
}

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: RouteResponse = [false, 400, ""];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [405, `Method ${method ?? ''} Not Allowed`];
    }

    if (typeof message !== "object") message = { message };

    res.status(status).json({ success, ...message });
}
