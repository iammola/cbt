import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { GroupedUserModel, StudentModel, TeacherModel } from "db/models";

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
      const arr = [
        ["Teacher", TeacherModel.findOne({ code }, "name email").lean()],
        ["Student", StudentModel.findOne({ code }, "name email").lean()],
        ["GroupedUser", GroupedUserModel.findOne({ code }, "name email").lean()],
      ] as const;

      const results = await Promise.all(
        arr.map(async ([access, query]) => {
          const result = await query;
          if (result == null) return null;

          return [access, result] as const;
        })
      );

      const found = results.find((r) => r != null);
      if (found == undefined) throw new Error("User does not exist");

      const [access, user] = found;
      [success, status, message] = [
        true,
        StatusCodes.OK,
        {
          data: { ...user, access },
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
