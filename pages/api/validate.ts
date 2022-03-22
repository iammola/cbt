import type { NextApiRequest, NextApiResponse } from "next";

import { connect } from "db";
import { CBTResultModel, SessionModel, StudentModel } from "db/models";

import type { CBTResultRecord } from "types";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  await connect();
  const session = await SessionModel.findOne({ "terms.current": true }, "terms._id.$").lean();
  const students = await StudentModel.find({}, "name.full academic").lean();
  await Promise.all(
    students.map(async (student) => {
      const cbt_result: CBTResultRecord<true> = await CBTResultModel.findOne(
        {
          student: student._id,
          term: session?.terms[0]._id,
        },
        "results"
      )
        .populate("results.exam", "subjects questions")
        .lean();
      if (!cbt_result) return;

      await Promise.all(
        cbt_result.results.map(async ({ answers, exam }) => {
          answers.forEach(({ answer, question }) => {
            exam.questions.find((q) => q._id.equals(question));
          });
        })
      );
    })
  );

  res.json({});
}
