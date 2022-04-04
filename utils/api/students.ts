import { Types } from "mongoose";

import { ClassModel, SubjectsModel, ResultModel } from "db/models";

import type { StudentRecord, SubjectRecord } from "types";

export async function formatIncompleteResultReport(term: any, students: StudentRecord[]) {
  const { classIDs, subjectIDs, studentIDs } = students.reduce(
    (acc, b) => {
      const classSet = new Set<string>(acc.classIDs);
      const subjectsSet = new Set<string>(acc.subjectIDs);

      b.academic[0].subjects.forEach((s) => subjectsSet.add(s.toString()));

      return {
        subjectIDs: [...subjectsSet],
        studentIDs: [...acc.studentIDs, b._id],
        classIDs: [...classSet.add(b.academic[0].class.toString())],
      };
    },
    {
      classIDs: [],
      subjectIDs: [],
      studentIDs: [],
    } as Record<"classIDs" | "subjectIDs", string[]> & { studentIDs: unknown[] }
  );

  const [classes, [subjects], results] = await Promise.all([
    ClassModel.find({ _id: classIDs }, "name").lean(),
    SubjectsModel.aggregate<Record<"subjects", SubjectRecord[]>>([
      {
        $match: {
          "subjects._id": {
            $in: subjectIDs.map((s) => new Types.ObjectId(s)),
          },
        },
      },
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
    ]),
    ResultModel.find({ student: studentIDs, term }, "comment data.subject").lean(),
  ]);

  const data = students.map((s) => {
    const session = s.academic[0];
    const check = {
      _id: s._id,
      name: s.name.full,
      class: classes.find((c) => c._id.equals(session.class))?.name ?? "Class not found",
    };
    const result = results.find((r) => r.student.equals(s._id));

    if (!result)
      return {
        ...check,
        report: [
          {
            state: false,
            message: "No result data",
          },
        ],
      };

    const { comments, data } = result;
    const report = [
      {
        state: !!comments,
        message: comments ? "Comments" : "No Comments",
      },
    ];

    report.push(
      ...session.subjects.map((s) => {
        const state = !!data.find((d) => d.subject.equals(s));
        const subject = subjects.subjects.find((sub) => sub._id.equals(s))?.name ?? "Subject not found";

        return {
          state,
          message: `${state ? "Scores" : "No Scores"} for ${subject}`,
        };
      })
    );

    return { ...check, report };
  });

  return data;
}
