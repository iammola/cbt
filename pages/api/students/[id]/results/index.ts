import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ResultModel, SessionModel } from "db/models";

import type { ServerResponse } from "types";
import type { StudentResultGETData } from "types/api";

async function getStudentResult({ id, term }: any): Promise<ServerResponse<StudentResultGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentResultGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (!term) {
      const session = await SessionModel.findOne({ "terms.current": true }, { "terms._id.$": true }).lean();
      term = session?.terms[0]._id;
    }

    const data = await ResultModel.findOne({ student: id, term }, "-_id -student").lean();
    if (data === null) throw new Error("Student has no result record");

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
  let [success, status, message]: ServerResponse<StudentResultGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getStudentResult(query);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
