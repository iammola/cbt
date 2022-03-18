import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ResultModel, SessionModel, StudentModel } from "db/models";

import type { ServerResponse } from "types";
import type { ClassResultGETData } from "types/api/classes";

async function getClassResultStats({
  id,
  term,
}: any): Promise<ServerResponse<ClassResultGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<ClassResultGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const students = await StudentModel.find(
      {
        "academic.terms": {
          $elemMatch: { term, class: id },
        },
      },
      "_id"
    ).lean();

    const results = await ResultModel.find({
      student: { $in: students.map((i) => i._id) },
    }).lean();

    const scores = results.map(({ data }) => {
      const total = data.reduce(
        (acc, entry) =>
          acc +
          (entry.total ??
            entry.scores?.reduce((acc, item) => acc + item.score, 0) ??
            0),
        0
      );

      return {
        total,
        average: (total / ((data?.length ?? 1) * 1e2)) * 1e2,
      };
    });

    const totals = scores.map((item) => item.total);
    const averages = scores.map((item) => item.average);

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: {
          highest: Math.max(...totals),
          lowest: Math.min(...totals),
          average: {
            lowest: Math.min(...averages),
            highest: Math.max(...averages),
            class: averages.reduce((a, b) => a + b, 0) / averages.length,
          },
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

  return [success, status, message];
}

export default async function handler(
  { method, query }: NextApiRequest,
  res: NextApiResponse
) {
  let [success, status, message]: ServerResponse<ClassResultGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [
      StatusCodes.METHOD_NOT_ALLOWED,
      ReasonPhrases.METHOD_NOT_ALLOWED,
    ];
  } else [success, status, message] = await getClassResultStats(query);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
