import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ResultModel } from "db/models";

import type { ResultRecord, ServerResponse } from "types";
import type { StudentResultSubjectGETData, StudentResultSubjectPOSTData } from "types/api/students";

async function getStudentSubjectResult({
  subjectId,
  ...query
}: any): Promise<ServerResponse<StudentResultSubjectGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentResultSubjectGETData> = [
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
  { term, ...body }: Omit<ResultRecord["data"][number], "subject"> & { term: string }
): Promise<ServerResponse<StudentResultSubjectPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentResultSubjectPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    let ok = true;
    const data = { subject, ...body };
    const [termExists, termSubjectExists] = await Promise.all([
      ResultModel.exists({ term, student }),
      ResultModel.exists({ term, student, "data.subject": subject }),
    ]);

    if (termExists === null) await ResultModel.create({ student, term, data: [data] });
    else {
      const query = termSubjectExists ? { "data.$[i]": data } : { $push: { data } };
      ok = (
        await ResultModel.updateOne({ _id: termExists._id }, query, {
          runValidators: true,
          arrayFilters: [{ "i.subject": subject }],
        })
      ).acknowledged;
    }

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { ok },
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
  let [success, status, message]: ServerResponse<StudentResultSubjectGETData | StudentResultSubjectPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else
    [success, status, message] = await (method === "POST"
      ? updateStudentSubjectResult(query.id, query.subjectId, JSON.parse(body))
      : getStudentSubjectResult(query));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
