import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { EventModel, ExamModel, SessionModel, SubjectsModel } from "db/models";

import type { ServerResponse } from "types";
import type { ClassExamGETData } from "types/api";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";

async function getExams({ id, filter }: any): Promise<ServerResponse<ClassExamGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<ClassExamGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const [currentSession, data] = await Promise.all([
      SessionModel.findOne({ "terms.current": true }, { "terms._id.$": true }).lean(),
      SubjectsModel.findOne({ class: id }, "-subjects.teachers").lean(),
    ]);

    if (data === null) throw new Error("Class does not exist");
    if (currentSession === null) throw new Error("Current Session does not exist");

    let examsRecord = await ExamModel.find(
      {
        term: currentSession.terms[0]._id,
        subject: data.subjects.map(({ _id }) => _id),
      },
      "subject"
    ).lean();

    if (filter) {
      const data = await Promise.all(
        examsRecord.map(async (e) => ({
          ...e,
          event: await EventModel.exists({ exams: e._id }),
        }))
      );

      if (filter === "scheduled") examsRecord = data.filter((e) => e.event !== null);
      if (filter === "unscheduled") examsRecord = data.filter((e) => e.event === null);
    }

    const exams = examsRecord.map(({ _id, subject }) => {
      const { name = "", alias } = data.subjects.find(({ _id }) => _id.equals(subject)) ?? {};
      return { _id, name, alias };
    });

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { exams },
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
  let [success, status, message]: ServerResponse<ClassExamGETData> = [
    false,
    StatusCodes.BAD_REQUEST,
    ReasonPhrases.BAD_REQUEST,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getExams(query);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
