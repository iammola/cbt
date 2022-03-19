import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ClassModel, SessionModel, StudentModel } from "db/models";

import type { ServerResponse } from "types";
import type { StudentClassGETData } from "types/api/students";

async function getStudentClass({ id, term }: any): Promise<ServerResponse<StudentClassGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentClassGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (!term) {
      const session = await SessionModel.findOne({ "terms.current": true }, "terms._id.$");
      if (!session) throw new Error("Term not defined");

      term = session.terms[0]._id;
    }
    const student = await StudentModel.findOne(
      {
        _id: id,
        "academic.term": term,
      },
      "academic.$"
    ).lean();
    if (student === null) throw new Error("Student not found");

    const data = await ClassModel.findById(student.academic[0].class, "-resultTemplate").lean();
    if (data === null) throw new Error("Class not found");

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

  return [success, status, message];
}

export default async function handler({ method, query }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<StudentClassGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getStudentClass(query);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
