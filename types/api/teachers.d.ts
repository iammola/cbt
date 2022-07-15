import type { CBTResultRecord, ClassRecord, ExamRecord, RecordId, SubjectRecord, UserRecord } from "types";

export type TeachersPOSTData = Pick<UserRecord, "code">;

export type TeacherClassGETData = ClassRecord[];

export type TeacherClassSubjectGETData = {
  subjects: Omit<SubjectRecord, "teachers">[];
};

export type TeacherExamsGETData = (Pick<ExamRecord<true>, "created"> &
  Omit<ExamRecord, "created" | "subject" | "questions"> & {
    class: string;
    subject: string;
    questions: number;
  })[];

export type TeacherExamGETData = RecordId & {
  questions: QuestionRecord[];
  details: Pick<ExamRecord<true>, "duration" | "instructions" | "subject"> & {
    name: {
      class: string;
      subject: string;
      createdBy: string;
    };
    term: string;
  };
};

export type TeacherSubjectsGETData = RecordId["_id"][];

export type TeacherSubjectsExtendGETData = {
  name: string;
  subjects: Omit<SubjectRecord, "teachers">[];
}[];

export type TeacherCBTResultsGETData = Pick<CBTResultRecord<true>, "student" | "results">[];
