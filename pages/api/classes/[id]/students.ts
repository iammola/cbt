import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel, StudentModel, SubjectsModel } from "db/models";

import type { ServerResponse } from "types";
import type { ClassStudentsGETData } from "types/api/classes";

async function getClassStudents({ id, term }: any): Promise<ServerResponse<ClassStudentsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<ClassStudentsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const record = await SubjectsModel.findOne({ class: id }, "-_id subjects._id").lean();

    const data = await StudentModel.find(
      {
        academic: {
          $elemMatch: {
            term,
            subjects: { $in: record?.subjects.map((sub) => sub._id) },
          },
        },
      },
      "name academic.$"
    ).lean();

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
  let [success, status, message]: ServerResponse<ClassStudentsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getClassStudents(query);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
