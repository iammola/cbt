import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel } from "db/models";

import type { ExamsPOSTData, LoginData } from "types/api";
import type { ServerResponse, ExamRecord, CreateQuestion } from "types";

async function createExam(body: PostBody, account: LoginData): Promise<ServerResponse<ExamsPOSTData>> {
  await connect();

  let [success, status, message]: ServerResponse<ExamsPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  const { subject, term } = body.exam;
  const { createdBy, questions } = body;

  try {
    if (account.access !== "Teacher" && account.access !== "GroupedUser") throw new Error("Invalid User Type");
    if (await ExamModel.exists({ subject, term })) throw new Error("Subject Exam already created");

    const { _id } = await ExamModel.create({
      ...body.exam,
      questions,
      created: {
        at: new Date(),
        by: account._id,
        model: account.access,
        name: account.access === "GroupedUser" ? createdBy : undefined,
      },
    });

    [success, status, message] = [
      true,
      StatusCodes.CREATED,
      {
        data: { _id },
        message: ReasonPhrases.CREATED,
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

export default async function handler({ body, method, cookies }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<ExamsPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "POST";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else {
    if (!cookies.account) throw new Error("Account is required");
    [success, status, message] = await createExam(JSON.parse(body), JSON.parse(cookies.account) as LoginData);
  }

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}

type PostBody = {
  exam: ExamRecord;
  createdBy: string;
  questions: CreateQuestion[];
};
