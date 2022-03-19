import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, SessionModel, StudentModel, SubjectsModel } from "db/models";

import type { ServerResponse, SubjectsRecord } from "types";
import type { StudentExamGETData } from "types/api/students";

async function getExam(studentId: any, examId: any): Promise<ServerResponse<StudentExamGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentExamGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const session = await SessionModel.findOne({ "terms.current": true }, "terms.$").lean();
    if (session === null) throw new Error("No Current Session");

    const student = await StudentModel.findOne(
      {
        _id: studentId,
        "academic.term": session.terms[0]._id,
      },
      "-_id academic.$"
    ).lean();

    if (student === null) throw new Error("Student does not exist");
    if (student.academic.length === 0) throw new Error("Student does not have current session data");

    const exam = await ExamModel.findOne(
      {
        _id: examId,
        subjectId: { $in: student.academic[0].subjects },
      },
      "-created -edited"
    ).lean();

    if (exam === null) throw new Error("Exam not found / Student not authorized to get exam");

    const { duration, instructions, questions, subjectId } = exam;

    const subject: SubjectsRecord<true> = await SubjectsModel.findOne(
      { "subjects._id": subjectId },
      "class subjects.name.$"
    )
      .populate("class", "-_id name")
      .lean();

    if (subject === null) throw new Error("Exam Subject not found");

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: {
          _id: examId,
          questions,
          details: {
            duration,
            subjectId,
            instructions,
            name: {
              class: subject.class.name,
              subject: subject?.subjects[0].name,
            },
          },
        },
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
  let [success, status, message]: ServerResponse<StudentExamGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getExam(query.id, query.examId);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
