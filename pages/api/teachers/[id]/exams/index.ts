import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, SessionModel, SubjectsModel } from "db/models";

import type { TeacherExamsGETData } from "types/api/teachers";
import type { ExamRecord, ServerResponse, SubjectsRecord } from "types";

async function getExams(id: any): Promise<ServerResponse<TeacherExamsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<TeacherExamsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const currentSession = await SessionModel.findOne(
      { "terms.current": true },
      { "terms._id.$": true }
    ).lean();
    const exam: (Omit<ExamRecord, "created"> &
      Pick<ExamRecord<true>, "created">)[] = await ExamModel.find(
      {
        "created.by": id,
        termId: currentSession?.terms[0]._id,
      },
      "-instructions -edited"
    )
      .populate("created.by")
      .lean();

    const subjects: SubjectsRecord<true>[] = await SubjectsModel.find(
      { "subjects._id": exam.map(({ subjectId }) => subjectId) },
      "-_id class subjects._id subjects.name"
    )
      .populate("class", "name")
      .lean();

    const data = exam.map(({ subjectId, questions, ...exam }) => {
      const item = subjects.find(({ subjects }) =>
        subjects.find(({ _id }) => subjectId.equals(_id))
      );

      return {
        ...exam,
        class: item?.class?.name ?? "",
        questions: questions.length,
        subject:
          item?.subjects.find(({ _id }) => _id.equals(subjectId))?.name ?? "",
      };
    });

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

export default async function handler(
  { method, query }: NextApiRequest,
  res: NextApiResponse
) {
  let [success, status, message]: ServerResponse<TeacherExamsGETData> = [
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
  } else [success, status, message] = await getExams(query.id);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
