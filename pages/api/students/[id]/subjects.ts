import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SessionModel, StudentModel, SubjectsModel } from "db/models";

import type { ServerResponse, SubjectRecord } from "types";
import type { StudentSubjectsGETData } from "types/api/students";

async function getStudentSubjects({ id, term }: any): Promise<ServerResponse<StudentSubjectsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentSubjectsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const data = await StudentModel.findOne(
      {
        _id: id,
        "academic.term": term,
      },
      "academic.$"
    ).lean();

    if (data === null) throw new Error("Invalid Student");

    const subjectIDs = data.academic[0].subjects;
    const subjects = await SubjectsModel.aggregate([
      { $match: { "subjects._id": { $in: subjectIDs } } },
      {
        $project: {
          subjects: {
            $filter: {
              input: "$subjects",
              cond: {
                $in: ["$$this._id", subjectIDs],
              },
            },
          },
        },
      },
    ]).then((doc) => doc.map((item) => item.subjects.map(({ _id, name }: SubjectRecord) => ({ _id, name }))));

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: subjects,
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
  let [success, status, message]: ServerResponse<StudentSubjectsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getStudentSubjects(query);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
