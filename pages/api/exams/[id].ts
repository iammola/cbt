import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel } from "db/models";

import type { ExamPUTData, LoginData } from "types/api";
import type { CreateQuestion, ExamRecord, ServerResponse } from "types";

async function updateExam(_id: any, account: LoginData, body: PutBody): Promise<ServerResponse<ExamPUTData>> {
  await connect();
  let [success, status, message]: ServerResponse<ExamPUTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  const { createdBy, exam, questions } = body;
  try {
    if (account.access !== "Teacher" && account.access !== "GroupedUser") throw new Error("Invalid User Type");

    const edited = {
      at: new Date(),
      by: account._id,
      model: account.access,
      name: account.access === "GroupedUser" ? createdBy : undefined,
    };

    await ExamModel.updateOne({ _id }, { ...exam, questions, $push: { edited } }, { runValidators: true });

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
  } else {
    if (!cookies.account) throw new Error("Account is required");
    [success, status, message] = await updateExam(query.id, JSON.parse(cookies.account) as LoginData, JSON.parse(body));
  }

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}

type PutBody = {
  exam: ExamRecord;
  createdBy: string;
  questions: CreateQuestion[];
};
