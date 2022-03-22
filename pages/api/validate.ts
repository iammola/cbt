import type { NextApiRequest, NextApiResponse } from "next";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { connect } from "db";

import type { ServerResponse } from "types";
import type { PingData, PingError } from "types/api";
import { StudentModel, ResultModel } from "db/models";

export default async function handler({ body, method }: NextApiRequest, res: NextApiResponse) {
  await connect();
  const students = await StudentModel.find({}, "name.full academic").lean();
  const data = (
    await Promise.all(
      students.map(async (student) => {
        const result = await ResultModel.findOne({ student: student._id }, "data").lean();
        if (result === null) return;
        const errors = student.academic[0].subjects
          .map((subject) => {
            const subjectResult = result.data.filter((res) => res.subject.equals(subject)).length;

            if (subjectResult > 1) return `Duplicate Subject ${subject}`;
            if (subjectResult === 0) return `Subject ${subject} non-existent`;
          })
          .filter(Boolean);

        return { student: student.name.full, errors };
      })
    )
  ).filter((i) => (i?.errors.length ?? 0) > 0);

  res.json({ data });
}
