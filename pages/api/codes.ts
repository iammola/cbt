import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel, StudentModel } from "db/models";

import type { ServerResponse } from "types";
import type { LoginData } from "types/api";

async function getCodes(account: LoginData): Promise<ServerResponse<unknown>> {
  await connect();

  let [success, status, message]: ServerResponse<unknown> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (account.access !== "Teacher" && account.access !== "GroupedUser") throw new Error("Invalid User Type");

    const currentSession = await SessionModel.findOne({ "terms.current": true }, { "terms._id.$": true }).lean();

    const students = await StudentModel.find(
      { "academic.term": currentSession?.terms[0]._id },
      "name.full code academic.class.$"
    )
      .populate({ path: "academic.class", model: "Class", select: "name order" })
      .sort({ "name.full": "asc" })
      .lean();

    [success, status, message] = [true, StatusCodes.OK, { data: { students }, message: ReasonPhrases.OK }];
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
  let [success, status, message]: ServerResponse<unknown> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getCodes(JSON.parse(cookies.account ?? ""));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
