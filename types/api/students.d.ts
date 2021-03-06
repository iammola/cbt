import type { ResultGrade, SettingsRecord } from "types/models";
import type { RecordId, ClassRecord, ExamRecord, ResultRecord, StudentRecord, SubjectRecord } from "types";

export type StudentsGETData = StudentRecord[];

export type StudentsPOSTData = Pick<StudentRecord, "code">;

export type StudentResultPOSTData = {
  score: number;
};

export type StudentGETData = StudentRecord | null;

export type StudentCBTResultsGETData = {
  date: Date;
  score: number;
  time: number;
  subject: string;
  attempts: number;
}[];

export type StudentExamsGETData = (Pick<ExamRecord, "_id" | "duration"> & {
  date: Date;
  subject: string;
  questions: number;
})[];

export type StudentExamGETData = RecordId & {
  questions: QuestionRecord[];
  details: Pick<ExamRecord<true>, "duration" | "instructions" | "subject"> & {
    name: {
      class: string;
      subject: string;
    };
  };
};

export type StudentResultSubjectGETData = Omit<ResultRecord["data"][number], "subject">;

export type StudentResultSubjectPOSTData = {
  ok: boolean;
};

export type StudentCommentGETData = Pick<ResultRecord, "comments"> | null;

export type StudentCommentPOSTData = { ok: boolean };

export type StudentAcademicGETData = StudentRecord["academic"];

export type StudentAcademicPUTData = { ok: boolean };

export type StudentAcademicDELETEData = { ok: boolean };

export type StudentClassGETData = Omit<ClassRecord, "resultTemplate">;

export type StudentSubjectsGETData = Pick<SubjectRecord, "_id" | "name">[];

export type StudentResultGETData = Pick<ResultRecord, "comments" | "data">;

export type StudentTranscriptGETData = {
  scores: Record<string, TranscriptScore[]>;
  grading: SettingsRecord["transcriptGrade"];
  sessions: Pick<SessionRecord, "_id" | "name">[];
};

export type TranscriptScore = {
  score?: number;
  grade?: string;
  termsCount: number;
  session: RecordId["_id"];
};

export type TranscriptTermScore = {
  term: RecordId["_id"];
  subjects: Record<string, number | undefined>;
};

export type StudentResultStatusData = RecordId & {
  name: string;
  class: string;
  report: {
    state: boolean;
    message: string;
  }[];
};
