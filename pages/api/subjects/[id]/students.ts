import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel, StudentModel } from "db/models";

import type { ServerResponse } from "types";
import type { SubjectStudentsGETData } from "types/api/subjects";

export default async function handler({ method }: NextApiRequest, res: NextApiResponse) {
async function getStudents(subjectId: any): Promise<ServerResponse<SubjectStudentsGETData>> {
    await connect();
    let [success, status, message]: ServerResponse<SubjectStudentsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const currentSession = await SessionModel.findOne({ current: true, "terms.current": true }, 'terms._id.$').lean();
        if (currentSession === null) throw new Error("Current session not found");

        const students = await StudentModel.find({
            academic: {
                $elemMatch: {
                    session: currentSession._id,
                    terms: {
                        $elemMatch: {
                            term: currentSession.terms[0]._id,
                            subjects: subjectId,
                        }
                    }
                }
            }
        }, 'name').lean();

        [success, status, message] = [true, StatusCodes.OK, {
            data: { students },
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

    let [success, status, message]: ServerResponse<SubjectStudentsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    }

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
