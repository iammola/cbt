import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import {
  ResultModel,
  SessionModel,
  StudentModel,
  SubjectsModel,
} from "db/models";

import type { ServerResponse, SubjectsRecord } from "types";
import type {
  StudentTranscriptGETData,
  TranscriptScore,
  TranscriptTermScore,
} from "types/api/students";

async function getStudentTranscript(
  id: any
): Promise<ServerResponse<StudentTranscriptGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentTranscriptGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const [sessions, student, results] = await Promise.all([
      SessionModel.find({}, "name terms._id").lean(),
      StudentModel.findById(id, "academic").lean(),
      ResultModel.find({ student: id }, "data term").lean(),
    ]);

    if (!student) throw new Error("Student not found");
    const subjectIDs = student.academic
      .map((i) => i.terms.map((t) => t.subjects).flat())
      .flat();

    const subjects = (
      await SubjectsModel.aggregate([
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
      ])
    )
      .map((j) =>
        (j as SubjectsRecord).subjects
          .map(({ _id, name }) => ({ _id, name }))
          .flat()
      )
      .flat();

    const scores = results
      .reduce(
        (acc, { data, term }) => [
          ...acc,
          ...data.map(({ subject, scores, total }) => ({
            subject,
            term,
            score: total ?? scores?.reduce((acc, item) => acc + item.score, 0),
          })),
        ],
        [] as TranscriptTermScore[]
      )
      .reduce((acc, { term, score, subject }) => {
        const session = sessions.find((session) =>
          session.terms.find((item) => item._id.equals(term))
        )?._id;

        if (!session) {
          console.log("Term: ", term, ". No session found");
          return acc;
        }

        if (!score) return acc;

        const subjectIdx = acc.findIndex(({ data, ...item }) =>
          item.subject.equals(subject)
        );

        const newValue = {
          score,
          session,
          termsCount: 1,
        };

        if (subjectIdx === -1)
          return [
            ...acc,
            {
              subject,
              data: [newValue],
            },
          ];

        const [item] = acc.splice(subjectIdx, 1);
        const sessionIdx = item.data.findIndex((t) =>
          t.session.equals(session)
        );

        if (sessionIdx > -1) {
          ++item.data[sessionIdx].termsCount;
          item.data[sessionIdx].score =
            score + (item.data[sessionIdx].score ?? 0);
        } else item.data.push(newValue);

        return [...acc, item];
      }, [] as TranscriptScore[])
      .reduce((acc, b) => {
        b.data.forEach((i) => {
          if (i.score) {
            i.score /= i.termsCount;
            i.grade = i.score.toString(); // Find Grade
          }
        });
        return [...acc, b];
      }, [] as StudentTranscriptGETData["scores"]);

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        data: { sessions, scores, subjects },
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
  let [success, status, message]: ServerResponse<StudentTranscriptGETData> = [
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
  } else [success, status, message] = await getStudentTranscript(query.id);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
