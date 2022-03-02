import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, SubjectsModel } from "db/models";

import type { ServerResponse } from "types";
import type { ClassExamGETData } from "types/api/classes";

async function getExams(
  classId: any
): Promise<ServerResponse<ClassExamGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<ClassExamGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const data = await SubjectsModel.findOne(
      { class: classId },
      "-subjects.teachers"
    ).lean();
    if (data === null) throw new Error("Class does not exist");

    const examsRecord = await ExamModel.find(
      { subjectId: data.subjects.map(({ _id }) => _id) },
      "subjectId"
    ).lean();
    const exams = examsRecord.map(({ _id, subjectId }) => {
      const { name = "", alias } =
        data.subjects.find(({ _id }) => _id.equals(subjectId)) ?? {};
      return { _id, name, alias };
    });

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { exams },
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

export default async function handler(
  { query, method }: NextApiRequest,
  res: NextApiResponse
) {
  let [success, status, message]: ServerResponse<ClassExamGETData> = [
    false,
    StatusCodes.BAD_REQUEST,
    ReasonPhrases.BAD_REQUEST,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [
      StatusCodes.METHOD_NOT_ALLOWED,
      ReasonPhrases.METHOD_NOT_ALLOWED,
    ];
  } else [success, status, message] = await getExams(query.id);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
