import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel, StudentModel, SubjectsModel } from "db/models";

import type { ServerResponse } from "types";
import type { StudentSubjectsGETData } from "types/api/students";

async function getStudentSubjects(student: any): Promise<ServerResponse<StudentSubjectsGETData>> {
    await connect();
    let [success, status, message]: ServerResponse<StudentSubjectsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const currentSession = await SessionModel.findOne({ current: true, "terms.current": true }, 'terms._id.$').lean();
        if (currentSession === null) throw new Error("Current session");
        
        const term = currentSession.terms[0]._id;
        const data = await StudentModel.findOne({
            student,
            academic: {
                $elemMatch: {
                    session: currentSession._id,
                    "terms.term": term
                }
            }
        }, 'academic.terms.$').lean();

        if (data === null) throw new Error("Invalid Student");

        const d = data.academic[0].terms.find(item => item.term.equals(term));

        const subjects = await SubjectsModel.findOne({
            class: d?.class
        }, 'subjects.name').lean();

        [success, status, message] = [true, StatusCodes.OK, {
            data: subjects?.subjects.filter(subject => d?.subjects.includes(subject._id)) ?? [],
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

export default async function handler({ method, query }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<StudentSubjectsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else [success, status, message] = await getStudentSubjects(query.id);

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
