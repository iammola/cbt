import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, SubjectsModel, TeacherModel } from "db/models";

import type { LoginData, TeacherExamGETData } from "types/api";
import type { ServerResponse, SubjectsRecord } from "types";

async function getExam(query: any, account: LoginData): Promise<ServerResponse<TeacherExamGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<TeacherExamGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (!(await TeacherModel.exists({ _id: query.id }))) throw new Error("Teacher does not exist");

    const exam = await ExamModel.findById(query.exam, "-created -edited").lean();
    if (exam === null) throw new Error("Exam ID not found");

    const { _id, questions, term, ...rest } = exam;

    const subject: SubjectsRecord<true> = await SubjectsModel.findOne(
      {
        subjects: {
          $elemMatch: {
            _id: exam.subject,
            teachers: query.id,
          },
        },
      },
      "class subjects.$"
    )
      .populate("class", "-_id name")
      .lean();

    if (subject === null) throw new Error("Exam Subject not found / Teacher not authorized to GET exam");

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: {
          _id,
          questions,
          details: {
            ...rest,
            term: term.toHexString(),
            subject: subject.subjects[0],
            name: {
              class: subject.class.name,
              subject: subject?.subjects[0].name,
              createdBy: account.name.full,
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

export default async function handler({ cookies, method, query }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<TeacherExamGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getExam(query, JSON.parse(cookies.account ?? "") as LoginData);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
