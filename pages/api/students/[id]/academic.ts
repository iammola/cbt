import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { StudentModel } from "db/models";

import type { ServerResponse } from "types";
import type { StudentAcademicGETData } from "types/api";

async function getStudentAcademicData({ id, term }: any): Promise<ServerResponse<StudentAcademicGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentAcademicGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const student = await StudentModel.findOne(
      Object.assign({ _id: id }, term && { "academic.term": term }),
      `academic${term ? ".$" : ""}`
    ).lean();
    if (student === null) throw new Error("Student not found");

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: student.academic,
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
  let [success, status, message]: ServerResponse<StudentAcademicGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getStudentAcademicData(query);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
