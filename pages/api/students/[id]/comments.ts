import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ResultModel, SessionModel } from "db/models";

import type { ServerResponse } from "types";
import type { StudentCommentGETData, StudentCommentPOSTData } from "types/api";

async function getComments({ id, term }: any): Promise<ServerResponse<StudentCommentGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentCommentGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (!term) {
      const session = await SessionModel.findOne({ "terms.current": true }, "terms._id.$").lean();
      term = session?.terms[0]._id;
    }

    const data = await ResultModel.findOne({ student: id, term }, "-_id comments").lean();

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

async function updateComments(student: any, comments: string): Promise<ServerResponse<StudentCommentPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentCommentPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const { acknowledged: ok } = await ResultModel.updateOne(
      { student },
      {
        $set: { comments },
      },
      { upsert: true }
    );

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { ok },
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

export default async function handler({ body, method, query }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<StudentCommentGETData | StudentCommentPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else
    [success, status, message] = await (method === "POST"
      ? updateComments(query.id, JSON.parse(body).comment)
      : getComments(query));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
