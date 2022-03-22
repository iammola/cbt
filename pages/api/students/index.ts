import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { generateCode } from "utils";

import { connect } from "db";
import { SessionModel, StudentModel } from "db/models";

import type { StudentRecord, ServerResponse } from "types";
import type { StudentsGETData, StudentsPOSTData } from "types/api";

async function getStudents(select: string): Promise<ServerResponse<StudentsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    [success, status, message] = [
      true,
      StatusCodes.CREATED,
      {
        data: await StudentModel.find({}, select).lean(),
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

async function createStudent({
  academic,
  ...student
}: Pick<StudentRecord, "email" | "name"> & {
  academic: { class: string; subject: string };
}): Promise<ServerResponse<StudentsPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentsPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const code = generateCode();
    const currentSession = await SessionModel.findOne({ "terms.current": true }, "terms._id.$").lean();

    await StudentModel.create({
      ...student,
      code,
      academic: [
        {
          ...academic,
          term: currentSession?.terms[0]._id,
        },
      ],
    });
    [success, status, message] = [
      true,
      StatusCodes.CREATED,
      {
        data: { code },
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

export default async function handler({ method, body, query }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<StudentsGETData | StudentsPOSTData> = [
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
      ? createStudent(JSON.parse(body))
      : getStudents(query.select as string));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
