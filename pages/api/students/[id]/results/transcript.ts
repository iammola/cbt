import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";
import { ResultModel, SettingsModel, SessionModel, StudentModel, SubjectsModel } from "db/models";

import type { ServerResponse, SubjectRecord } from "types";
import type { StudentTranscriptGETData, TranscriptTermScore } from "types/api/students";

async function getStudentTranscript(id: any): Promise<ServerResponse<StudentTranscriptGETData>> {
  await connect();
  let [success, status, message]: ServerResponse<StudentTranscriptGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];

  try {
    const [sessions, student, results, settings] = await Promise.all([
      SessionModel.find({}, "name terms._id").lean(),
      StudentModel.findById(id, "academic").lean(),
      ResultModel.find({ student: id }, "data term").lean(),
      SettingsModel.findOne({ active: true }, "transcriptGrade").lean(),
    ]);

    if (!student) throw new Error("Student not found");
    if (!settings?.transcriptGrade) throw new Error("Transcript Grading Required");

    const subjectIDs = student.academic.map((i) => i.terms.map((t) => t.subjects).flat()).flat();

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
    ]).then((data) =>
      data.map(({ subjects }) => subjects.map(({ _id, name }: SubjectRecord) => ({ _id, name })).flat()).flat()
    );

    const scores = Object.entries(
      results
        .reduce((acc, { data, term }) => {
          return [
            ...acc,
            {
              term,
              subjects: Object.fromEntries(
                data.map(
                  ({ subject, scores, total }) =>
                    [
                      subjects.find((i) => i._id.equals(subject))?.name ?? "Undefined Subject",
                      total ?? scores?.reduce((acc, item) => acc + item.score, 0),
                    ] as const
                )
              ),
            },
          ];
        }, [] as TranscriptTermScore[])
        .reduce((acc, { subjects, term }) => {
          const session = sessions.find((session) => session.terms.find((item) => item._id.equals(term)))?._id;

          if (!session) return acc;

          Object.entries(subjects).forEach(([subject, score]) => {
            const newValue = { score, session, termsCount: 1 };

            if (acc[subject] === undefined) return (acc[subject] = [newValue]);
            if (score === undefined) return acc;

            const sessionIdx = acc[subject].findIndex((t) => t.session.equals(session));

            if (sessionIdx < 0) acc[subject].push(newValue);
            else {
              ++acc[subject][sessionIdx].termsCount;
              acc[subject][sessionIdx].score = score + (acc[subject][sessionIdx].score ?? 0);
            }
          });

          return acc;
        }, {} as StudentTranscriptGETData["scores"])
    ).reduce((acc, [subject, data]) => {
      data.forEach((item) => {
        if (item.score) {
          item.score /= item.termsCount;
          item.grade = settings.transcriptGrade?.find((scheme) => (item.score ?? 0) < scheme.limit)?.grade;
        }
      });

      return {
        ...acc,
        [subject]: data,
      };
    }, {} as StudentTranscriptGETData["scores"]);

    [success, status, message] = [
      true,
      StatusCodes.OK,
      {
        message: ReasonPhrases.OK,
        data: {
          sessions,
          scores,
          grading: settings.transcriptGrade,
        },
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
  let [success, status, message]: ServerResponse<StudentTranscriptGETData> = [
    false,
    StatusCodes.INTERNAL_SERVER_ERROR,
    ReasonPhrases.INTERNAL_SERVER_ERROR,
  ];
  const allowedMethods = "GET";

  if (allowedMethods !== method) {
    res.setHeader("Allow", allowedMethods);
    [status, message] = [StatusCodes.METHOD_NOT_ALLOWED, ReasonPhrases.METHOD_NOT_ALLOWED];
  } else [success, status, message] = await getStudentTranscript(query.id);

  if (typeof message !== "object") message = { message, error: message };

  res.status(status).json({ success, ...message });
}
