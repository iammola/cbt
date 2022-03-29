import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { EventModel, ExamModel, CBTResultModel, SessionModel, StudentModel, SubjectsModel } from "db/models";

import type { StudentExamsGETData } from "types/api";
import type { RecordId, ServerResponse, SubjectRecord } from "types";

async function getExams(_id: any): Promise<ServerResponse<StudentExamsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentExamsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const session = await SessionModel.findOne({ "terms.current": true }, "-_id terms._id.$").lean();
    if (session === null) throw new Error("Session not found");

    const term = session.terms[0]._id;

    const [cbtResults, student] = await Promise.all([
      CBTResultModel.findOne({ student: _id, term }, "results.exam").lean(),
      StudentModel.findOne({ _id, "academic.term": term }, "academic.subjects.$").lean(),
    ]);

    if (student === null) throw new Error("Student not found");

    const exams = await ExamModel.find(
      {
        term,
        subject: { $in: student.academic[0].subjects },
        _id: { $nin: cbtResults?.results.map((r) => r.exam) ?? [] },
      },
      "duration questions subject"
    ).lean();

    const examIDs = exams.map((i) => i._id);
    const subjectIDs = exams.map((i) => i.subject);
    const [events, [subjects]] = await Promise.all([
      EventModel.aggregate<{ exams: RecordId["_id"][]; from: Date }>([
        { $match: { exams: { $in: examIDs } } },
        {
          $project: {
            from: 1,
            exams: {
              $filter: {
                input: "$exams",
                cond: { $in: ["$$this", examIDs] },
              },
            },
          },
        },
      ]),
      SubjectsModel.aggregate<Record<"subjects", SubjectRecord[]>>([
        { $match: { "subjects._id": { $in: subjectIDs } } },
        {
          $project: {
            subjects: {
              $filter: {
                input: "$subjects",
                cond: { $in: ["$$this._id", subjectIDs] },
              },
            },
          },
        },
      ]),
    ]);

    const data = events
      .map((item) =>
        item.exams.map((_id) => {
          const { duration, questions, subject } = exams.find((e) => _id.equals(e._id)) ?? {};

          return {
            _id,
            date: item.from,
            duration: duration ?? 0,
            questions: questions?.length ?? 0,
            subject: subjects?.subjects.find((s) => s._id.equals(subject ?? ""))?.name ?? "Subject not found",
          };
        })
      )
      .flat();

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data,
        message: ReasonPhrases.OK,
      },
    ];
  } catch (error: any) {
    [status, message] = [
      StatusCodes.BAD_REQUEST,
      {
        error: error.message,
        message: ReasonPhrases.BAD_REQUEST,
      },
    ];
  }

  return [success, status, message];
}

export default async function handler({ method, query }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<StudentExamsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getExams(query.id);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
