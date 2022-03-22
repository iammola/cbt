import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel } from "db/models";

import type { ServerResponse, ClassRecord } from "types";
import type { ClassesGETData, ClassesPOSTData } from "types/api";

async function getClasses(select: string = ""): Promise<ServerResponse<ClassesGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<ClassesGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const data = await ClassModel.find({}, select).lean();
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

async function createClass(item: ClassRecord): Promise<ServerResponse<ClassesPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<ClassesPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const data = (await ClassModel.create(item)).toObject();
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
  let [success, status, message]: ServerResponse<ClassesPOSTData | ClassesGETData> = [
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
      ? createClass(JSON.parse(body))
      : getClasses(query.select as string));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
