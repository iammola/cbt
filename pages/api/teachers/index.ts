import { startSession } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { generateCode } from "utils";

import { connect } from "db";
import { SubjectsModel, TeacherModel } from "db/models";

import type { TeachersPOSTData } from "types/api";
import type { TeacherRecord, ServerResponse } from "types";

async function createTeacher({
  subjects,
  ...teacher
}: TeacherRecord & { subjects: { [key: string]: string[] } }): Promise<ServerResponse<TeachersPOSTData>> {
  await connect();
  const session = await startSession();
  let [success, status, message]: ServerResponse<TeachersPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const code = generateCode();

    await session.withTransaction(async () => {
      const data = await TeacherModel.create([{ ...teacher, code }], {
        session,
      });

      await SubjectsModel.updateMany(
        { class: Object.keys(subjects) as any[] },
        {
          $addToSet: { "subjects.$[i].teachers": data[0]._id },
        },
        {
          session,
          runValidators: true,
          arrayFilters: [{ "i._id": { $in: Object.values(subjects).flat() } }],
        }
      );
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

export default async function handler({ method, query, body }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<TeachersPOSTData> = [
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
      ? createTeacher(JSON.parse(body))
      : [success, status, message]);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
