import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { EventModel, ExamModel, ResultModel, SessionModel, StudentModel, SubjectsModel } from "db/models";

import type { ServerResponse, SubjectRecord } from "types";
import type { StudentExamsGETData } from "types/api/students";

async function getExams(_id: any): Promise<ServerResponse<StudentExamsGETData>> {
    await connect();
    let [success, status, message]: ServerResponse<StudentExamsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];

    try {
        const session = await SessionModel.findOne({ current: true, "terms.current": true }, 'terms.$').lean();
        if (session === null) throw new Error("No Current Session");

        const student = await StudentModel.findOne({ _id, "academic.session": session._id, }, '-_id academic.$').lean();

        if (student === null) throw new Error("Student does not exist");
        if (student.academic.length === 0) throw new Error("Student does not have current session");

        const exams = await ExamModel.find({
            subjectId: {
                $in: student.academic[0].terms.find(i => i.term.equals(session.terms[0]._id))?.subjects
            }
        }, '_id duration questions subjectId').lean();
        const result = await ResultModel.findOne({ student: _id }).lean();

        const subjects = await SubjectsModel.find({ "subjects._id": exams.map(i => i.subjectId) }, '-_id subjects._id subjects.name').lean();

        const events = await EventModel.find({
            exams: { $in: exams.map(i => i._id) }
        }, '-_id').sort({ from: 1 }).lean();

        const data = events.map(event => event.exams.map(examId => {
            const exam = exams.find(exam => examId.equals(exam._id) && (result?.results ?? []).map(i => i.examId).includes(exam._id) === false);

            return exam === undefined ? undefined : {
                _id: examId,
                date: event.from,
                duration: exam.duration ?? 0,
                questions: exam.questions.length ?? 0,
                subject: subjects.map(i => i.subjects).flat().find(i => i._id.equals(exam?.subjectId))?.name ?? '',
            };
        })).flat().filter(Boolean) as StudentExamsGETData;

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

    return [success, status, message];
}

export default async function handler({ method, query }: NextApiRequest, res: NextApiResponse) {
    let [success, status, message]: ServerResponse<StudentExamsGETData> = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
    const allowedMethods = "GET";

    if (allowedMethods !== method) {
        res.setHeader("Allow", allowedMethods);
        [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
    } else[success, status, message] = await getExams(query.id)

    if (typeof message !== "object") message = { message, error: message };

    res.status(status).json({ success, ...message });
}
