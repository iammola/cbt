import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel } from "db/models";

import type { TermGETData } from "types/api/sessions";
import type { ServerResponse, TermRecord } from "types";

async function createTerm(id: string, term: TermRecord): Promise<ServerResponse<TermGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<TermGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (term.current) {
      const updateSession = SessionModel.updateMany({ current: true, _id: { $ne: id } }, { $unset: { current: "" } });
      const updateTerm = SessionModel.updateMany(
        { "terms.current": true },
        { $unset: { "terms.$[i].current": "" } },
        { arrayFilters: [{ "i.current": true }] }
      );
      await Promise.all([updateSession, updateTerm]);
    }

    const data = await SessionModel.findByIdAndUpdate(
      id,
      { $push: { terms: term } },
      {
        runValidators: true,
        returnDocument: "after",
      }
    ).lean();

    if (data === null) throw new Error("Invalid Session ID");

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { _id: data.terms.slice(-1)[0]._id },
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

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<TermGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["POST"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await createTerm(query.id as string, JSON.parse(body));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
