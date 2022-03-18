import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ResultModel } from "db/models";

import type { ResultRecord, ServerResponse } from "types";
import type {
  StudentResultSubjectGETData,
  StudentResultSubjectPOSTData,
} from "types/api/students";

async function getStudentSubjectResult({
  subjectId,
  ...query
}: any): Promise<ServerResponse<StudentResultSubjectGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentResultSubjectGETData> =
    [
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR,
    ];

  try {
    const result = await ResultModel.findOne(
      {
        term: query.term,
        student: query.id,
        "data.subject": subjectId,
      },
      "data.total data.scores.$"
    ).lean();

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: result?.data[0] ?? {},
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

async function updateStudentSubjectResult(
  student: any,
  subject: any,
  { term, ...body }: Omit<ResultRecord["data"], "subject"> & { term: string }
): Promise<ServerResponse<StudentResultSubjectPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentResultSubjectPOSTData> =
    [
      false,
      StatusCodes.INTERNAL_SERVER_ERROR,
      ReasonPhrases.INTERNAL_SERVER_ERROR,
    ];

  try {
    const record = await ResultModel.findOne(
      {
        student,
        "data.subject": subject,
      },
      "_id"
    ).lean();

    const args =
      record === null
        ? [
            { student },
            { term, $push: { data: { subject, ...body } } },
            { upsert: true },
          ]
        : [
            { _id: record._id },
            { term, $set: { "data.$[i]": { subject, ...body } } },
            {
              runValidators: true,
              fields: "_id",
              arrayFilters: [{ "i.subject": subject }],
            },
          ];

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: {
          ok: (await ResultModel.updateOne(...args)).acknowledged,
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
  { body, method, query }: NextApiRequest,
  res: NextApiResponse
) {
  let [success, status, message]: ServerResponse<
    StudentResultSubjectGETData | StudentResultSubjectPOSTData
  > = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [
      StatusCodes.METHOD_NOT_ALLOWED,
      ReasonPhrases.METHOD_NOT_ALLOWED,
    ];
  } else
    [success, status, message] = await (method === "POST"
      ? updateStudentSubjectResult(query.id, query.subjectId, JSON.parse(body))
      : getStudentSubjectResult(query));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
