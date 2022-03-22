import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, SubjectsModel } from "db/models";

import type { ExamPUTData } from "types/api";
import type { ServerResponse } from "types";

async function updateExam(
  _id: any,
  by: any,
  { exam, questions }: { exam: any; questions: any }
): Promise<ServerResponse<ExamPUTData>> {
  await connect();
  let [success, status, message]: ServerResponse<ExamPUTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    await ExamModel.updateOne(
      { _id },
      {
        ...exam,
        questions,
        $push: { edited: { by, at: new Date() } },
      },
      { runValidators: true }
    );

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { _id },
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

export default async function handler({ body, cookies, query, method }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<ExamPUTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "PUT";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await updateExam(query.id, JSON.parse(cookies.account)._id, JSON.parse(body));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
