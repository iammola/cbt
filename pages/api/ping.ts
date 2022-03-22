import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";

import type { ServerResponse } from "types";
import type { PingData, PingError } from "types/api";

export default async function handler({ body, method }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<PingData, PingError> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else {
    let start = Date.now();

    try {
      const db = await connect();
      [success, status, message] = [
        true,
        StatusCodes.OK,
        {
          data: {
            code: db.connection.readyState,
            time: (Date.now() - start) / 1e3,
            state: db.STATES[db.connection.readyState],
          },
          message: ReasonPhrases.OK,
        },
      ];
    } catch (error: any) {
      [status, message] = [
        StatusCodes.INTERNAL_SERVER_ERROR,
        {
          error: error.message,
          time: (Date.now() - start) / 1e3,
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      ];
    }
  }

  if (typeof message !== "object") message = { message, time: 0, error: message };

  res.status(status).json({ success, ...message });
}
