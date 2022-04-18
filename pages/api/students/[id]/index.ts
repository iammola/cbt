import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { StudentModel } from "db/models";

import type { ServerResponse, StudentRecord } from "types";
import type { StudentGETData } from "types/api";

type UpdateResult = Record<"success", boolean>;

async function updateStudent(_id: any, update: Partial<StudentRecord>): Promise<ServerResponse<UpdateResult>> {
  await connect();
  let [success, status, message]: ServerResponse<UpdateResult> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const res = await StudentModel.updateOne({ _id }, update);

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        message: ReasonPhrases.OK,
        data: { success: res.acknowledged },
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

async function getStudent(_id: any, select: any): Promise<ServerResponse<StudentGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const data = await StudentModel.findById(_id, select).lean();

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

export default async function handler({ body, method, query }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<StudentGETData | UpdateResult> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["GET", "PUT"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else
    [success, status, message] = await (method === "GET"
      ? getStudent(query.id, query.select)
      : updateStudent(query.id, JSON.parse(body)));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
