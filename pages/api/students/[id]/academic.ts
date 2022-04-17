import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { StudentModel } from "db/models";

import type { ServerResponse, StudentRecord } from "types";
import type { StudentAcademicDELETEData, StudentAcademicGETData, StudentAcademicPUTData } from "types/api";

async function updateStudentAcademicData(
  { id }: any,
  body: StudentRecord["academic"][number]
): Promise<ServerResponse<StudentAcademicPUTData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentAcademicPUTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const academicTermExists = await StudentModel.exists({ _id: id, "academic.term": body.term });
    const query = academicTermExists ? { "academic.$[i]": body } : { $push: { academic: body } };

    const updateQuery = await StudentModel.updateOne({ _id: id }, query, {
      runValidators: true,
      arrayFilters: [{ "i.term": body.term }],
    });

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { ok: updateQuery.acknowledged },
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

async function deleteStudentAcademicData({ id, term }: any): Promise<ServerResponse<StudentAcademicDELETEData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentAcademicDELETEData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  const updateQuery = await StudentModel.updateOne({ _id: id }, { $pull: { "academic.term": term } });

  [success, status, message] = [
    true,
    StatusCodes.OK,
    {
      data: { ok: updateQuery.acknowledged },
      message: ReasonPhrases.OK,
    },
  ];

  return [success, status, message];
}

async function getStudentAcademicData({ id, term }: any): Promise<ServerResponse<StudentAcademicGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentAcademicGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const student = await StudentModel.findOne(
      Object.assign({ _id: id }, term && { "academic.term": term }),
      `academic${term ? ".$" : ""}`
    ).lean();
    if (student === null) throw new Error("Student not found");

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: student.academic,
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
  let [success, status, message]: ServerResponse<
    StudentAcademicGETData | StudentAcademicDELETEData | StudentAcademicPUTData
  > = [false, StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR];
  const allowedMethods = ["DELETE", "GET", "PUT"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else
    [success, status, message] = await (method === "GET"
      ? getStudentAcademicData(query)
      : method === "PUT"
      ? updateStudentAcademicData(query, JSON.parse(body))
      : deleteStudentAcademicData(query));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}

type Update = Record<"success", boolean>;
