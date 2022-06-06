import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { StudentModel, TeacherModel } from "db/models";

import type { ServerResponse } from "types";
import type { LoginData } from "types/api";

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
      const result = await Promise.all([
        TeacherModel.findOne({ code }, "name email").lean(),
        StudentModel.findOne({ code }, "name email").lean(),
      ]);

      const user = result.find((q) => q != null);
      if (user == undefined) throw new Error("User does not exist");

      [success, status, message] = [
        true,
        StatusCodes.OK,
        {
          data: {
            ...user,
            access: (result.indexOf(user) === 0 ? "Teacher" : "Student") as LoginData["access"],
          },
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
