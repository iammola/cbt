import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import {
  ExamModel,
  CBTResultModel,
  StudentModel,
  SubjectsModel,
} from "db/models";

import type { CBTResultRecord, ServerResponse } from "types";
import type {
  StudentCBTResultsGETData,
  StudentResultPOSTData,
} from "types/api/students";

type RequestBody = Omit<
  CBTResultRecord["results"][number],
  "score" | "ended" | "answers"
> & { answers: { [key: string]: string } };

async function createResult(
  id: any,
  result: RequestBody
): Promise<ServerResponse<StudentResultPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentResultPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (!(await StudentModel.exists({ _id: id })))
      throw new Error("Student does not exist");
    const exam = await ExamModel.findById(
      result.examId,
      "-_id questions._id questions.answers._id questions.answers.isCorrect"
    ).lean();
    if (exam === null) throw new Error("Exam does not exist");

    const items = exam.questions
      .map(({ _id, answers }) => {
        const answer = result.answers[_id.toString()];
        return {
          _id,
          answer,
          score: +(answers.find((e) => e.isCorrect)?._id?.equals(answer) ?? 0),
        };
      })
      .filter((i) => i.answer);

    const score = items.reduce((a, b) => a + b.score, 0);

    await CBTResultModel.findOneAndUpdate(
      { student: id },
      {
        $push: {
          results: {
            ...result,
            score,
            ended: new Date(),
            answers: items.reduce(
              (a: any[], b) => [
                ...a,
                {
                  question: b._id,
                  answer: b.answer,
                },
              ],
              []
            ),
          },
        },
      },
      {
        lean: true,
        returnDocument: "after",
        fields: "student",
        upsert: true,
        runValidators: true,
      }
    );

    [success, status, message] = [
      true,
      StatusCodes.CREATED,
      {
        data: { score },
        message: ReasonPhrases.CREATED,
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

async function getResults(
  id: any
): Promise<ServerResponse<StudentCBTResultsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentCBTResultsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const record = await CBTResultModel.findOne(
      { student: id },
      "results.started results.score results.examId"
    ).lean();

    const exams = await ExamModel.find(
      { _id: record?.results.map((i) => i.examId) ?? [] },
      "subjectId"
    ).lean();
    const subjects = (
      await SubjectsModel.find(
        { "subjects._id": exams.map((e) => e.subjectId) },
        "subjects._id subjects.name"
      ).lean()
    )
      .map((i) => i.subjects)
      .flat();

    const data = exams.map((e) => {
      const { score, started } = record?.results.find((r) =>
        r.examId.equals(e._id)
      ) ?? { score: 0, started: new Date() };

      return {
        score,
        started,
        subject: subjects.find((s) => s._id.equals(e.subjectId))?.name ?? "",
      };
    });

    [success, status, message] = [
      true,
      StatusCodes.CREATED,
      {
        data,
        message: ReasonPhrases.CREATED,
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
  { body, query, method }: NextApiRequest,
  res: NextApiResponse
) {
  let [success, status, message]: ServerResponse<
    StudentResultPOSTData | StudentCBTResultsGETData
  > = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["POST", "GET"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [
      StatusCodes.METHOD_NOT_ALLOWED,
      ReasonPhrases.METHOD_NOT_ALLOWED,
    ];
  } else
    [success, status, message] = await (method === "POST"
      ? createResult(query.id, JSON.parse(body))
      : getResults(query.id));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
