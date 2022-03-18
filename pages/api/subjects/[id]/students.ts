import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { StudentModel } from "db/models";

import type { ServerResponse } from "types";
import type { SubjectStudentsGETData } from "types/api/subjects";

async function getStudents({ id, term }: any): Promise<ServerResponse<SubjectStudentsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<SubjectStudentsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const students = await StudentModel.find(
      { "academic.terms": { $elemMatch: { term, subjects: id } } },
      "name"
    ).lean();

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { students },
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
  let [success, status, message]: ServerResponse<SubjectStudentsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getStudents(query);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
