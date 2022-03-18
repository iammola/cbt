import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel } from "db/models";

import type { ServerResponse } from "types";
import type { TermGetData } from "types/api/sessions";

async function getTerm(
  id: any | "current"
): Promise<ServerResponse<TermGetData>> {
  await connect();
  let [success, status, message]: ServerResponse<TermGetData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const data = await SessionModel.findOne(
      id === "current" ? { "terms.current": true } : { "terms._id": id },
      "name alias terms._id.$"
    ).lean();

    if (data === null) throw new Error("Term not found");

    const { terms, ...session } = data;
    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        message: ReasonPhrases.OK,
        data: { session, ...terms[0] },
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
  { method, query }: NextApiRequest,
  res: NextApiResponse
) {
  let [success, status, message]: ServerResponse<TermGetData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [
      StatusCodes.METHOD_NOT_ALLOWED,
      ReasonPhrases.METHOD_NOT_ALLOWED,
    ];
  } else [success, status, message] = await getTerm(query.id);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
