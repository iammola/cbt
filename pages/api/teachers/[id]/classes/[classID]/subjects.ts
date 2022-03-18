import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { SubjectsModel } from "db/models";

import type { ServerResponse } from "types";
import { TeacherClassSubjectGETData } from "types/api/teachers";

async function getTeacherClassSubject(
  id: any,
  classID: any,
  select: any
): Promise<ServerResponse<TeacherClassSubjectGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<TeacherClassSubjectGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const subjects = (
      await SubjectsModel.find(
        {
          class: classID,
          "subjects.teachers": id,
        },
        select
      ).lean()
    )
      .map(({ subjects }) =>
        subjects
          .filter(({ teachers }) => teachers.find((teacher) => teacher.toString() === id))
          .map(({ teachers, ...item }) => item)
      )
      .flat();

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { subjects },
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

export default async function handler({ query, method }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<TeacherClassSubjectGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getTeacherClassSubject(query.id, query.classID, query.select);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
