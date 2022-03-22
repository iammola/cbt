import { Types } from "mongoose";
import { differenceInMinutes } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ExamModel, CBTResultModel, SessionModel, StudentModel, SubjectsModel } from "db/models";

import type { StudentCBTResultsGETData, StudentResultPOSTData } from "types/api";
import type { AnswerRecord, CBTResultRecord, ServerResponse, SubjectRecord } from "types";

type RequestBody = { answers: Record<string, string> } & Pick<CBTResultRecord["results"][number], "started" | "exam">;

async function createResult(_id: any, result: RequestBody): Promise<ServerResponse<StudentResultPOSTData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentResultPOSTData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    let score = 0;
    const ended = new Date();
    const [student, session] = await Promise.all([
      StudentModel.exists({ _id }),
      SessionModel.findOne({ "terms.current": true }, "terms._id.$").lean(),
    ]);

    if (!session) throw new Error("Session does not exist");
    if (!student) throw new Error("Student does not exist");

    const [exam] = await ExamModel.aggregate<Record<"answers", AnswerRecord[]>>([
      { $match: { _id: new Types.ObjectId(String(result.exam)) } },
      {
        $project: {
          answers: {
            $map: {
              input: "$questions",
              in: {
                $filter: {
                  input: "$$this.answers",
                  cond: { $ifNull: ["$$this.isCorrect", false] },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          answers: {
            $map: {
              input: "$answers",
              in: { $first: "$$this" },
            },
          },
        },
      },
    ]);

    const answers = Object.entries(result.answers).reduce((acc, [question, answer]) => {
      score += +!!exam.answers.findIndex((a) => a._id.equals(answer));
      return [...acc, { question, answer }];
    }, [] as Record<"question" | "answer", string>[]);

    await CBTResultModel.updateOne(
      { student: _id, term: session.terms[0]._id },
      { $push: { results: { ...result, score, answers, ended } } },
      {
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

async function getResults({ id, term }: any): Promise<ServerResponse<StudentCBTResultsGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentCBTResultsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    if (!term) {
      const session = await SessionModel.findOne({ "terms.current": true }, "terms._id.$").lean();
      term = session?.terms[0]._id;
    }

    const record: CBTResultRecord<true> = (await CBTResultModel.findOne({ student: id, term }, "results")
      .populate("results.exam", "subject")
      .lean()) ?? { results: [] };

    const subjectIDs = record.results.map((r) => r.exam.subject) ?? [];
    const [{ subjects = [] } = {}] = await SubjectsModel.aggregate<Record<"subjects", SubjectRecord[]>>([
      { $match: { "subjects._id": { $in: subjectIDs } } },
      {
        $project: {
          subjects: {
            $filter: {
              input: "$subjects",
              cond: { $in: ["$$this._id", subjectIDs] },
            },
          },
        },
      },
    ]);

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: record.results.map((r) => ({
          score: r.score,
          date: r.started,
          attempts: r.answers.length,
          time: differenceInMinutes(r.ended, r.started),
          subject: subjects.find((s) => s._id.equals(r.exam.subject))?.name ?? "Subject not found",
        })),
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

export default async function handler({ body, query, method }: NextApiRequest, res: NextApiResponse) {
  let [success, status, message]: ServerResponse<StudentResultPOSTData | StudentCBTResultsGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = ["POST", "GET"];

  if (!allowedMethods.includes(method ?? "")) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else
    [success, status, message] = await (method === "POST"
      ? createResult(query.id, JSON.parse(body))
      : getResults(query));

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
