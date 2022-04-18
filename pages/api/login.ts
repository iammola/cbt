import type { Model } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { StudentModel, TeacherModel } from "db/models";

import type { ServerResponse } from "types";
import type { LoginData } from "types/api";

import { promiseAny } from "utils";

async function findUser<M extends Model<any>>(model: M, access: "Teacher" | "Student", code: number) {
  const data = await model.findOne({ code }).select("name email").lean();
  if (data === null) throw new Error("User does not exist");

  return { ...data, access };
}

export default async function handler({ body, method }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<LoginData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "POST";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else {
    const { code } = JSON.parse(body);

    try {
      await connect();
      const promises = [findUser(TeacherModel, "Teacher", code), findUser(StudentModel, "Student", code)];
      const data = await (Promise.any?.(promises) ?? promiseAny(promises));

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
  }

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
