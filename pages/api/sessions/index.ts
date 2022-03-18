import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel } from "db/models";

import type { SessionRecord, ServerResponse } from "types";
import type { SessionsGETData, SessionsPOSTData } from "types/api/sessions";

async function getSessions(select: string): Promise<ServerResponse<SessionsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<SessionsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const data = await SessionModel.find({}, select).lean();
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

async function createSession(session: Omit<SessionRecord, "terms">): Promise<ServerResponse<SessionsPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<SessionsPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (session.current)
      await SessionModel.updateMany(
        { current: true },
        {
          current: false,
          $set: { "terms.$[i].current": false },
        },
        {
          runValidators: true,
          arrayFilters: [{ "i.current": true }],
        }
      );
    const data = (await SessionModel.create(session)).toObject();
    [success, status, message] = [
      true,
      StatusCodes.CREATED,
      {
        data,
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

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<SessionsPOSTData | SessionsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["POST", "GET"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else
    [success, status, message] = await (method === "POST"
      ? createSession(JSON.parse(body))
      : getSessions(query.select as string));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
