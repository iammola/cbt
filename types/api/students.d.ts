import { ResultGrade } from "types/models";
import { RecordId, ExamRecord, ResultRecord, StudentRecord, SubjectRecord } from "types";

export type StudentsGETData = StudentRecord[];

export type StudentsPOSTData = Pick<StudentRecord, "code">;

export type StudentResultPOSTData = {
  score: number;
};

export type StudentGETData = StudentRecord | null;

export type StudentCBTResultsGETData = {
  started: Date;
  score: number;
  subject: string;
}[];

export type StudentExamsGETData = (Pick<ExamRecord, "_id" | "duration"> & {
  date: Date;
  subject: string;
  locked?: boolean;
  questions: number;
})[];

export type StudentExamGETData = RecordId & {
  questions: QuestionRecord[];
  details: Pick<ExamRecord, "duration" | "instructions" | "subjectId"> & {
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

export type StudentSubjectsGETData = Pick<SubjectRecord, "_id" | "name">[];

export type StudentResultGETData = Pick<ResultRecord, "comments" | "data">;

export type StudentTranscriptGETData = {
  grading: ResultGrade[];
  sessions: Pick<SessionRecord, "_id" | "name">[];
  scores: Record<
    string,
    {
      score?: number;
      grade?: string;
      termsCount: number;
      session: RecordId["_id"];
    }[]
  >;
};

type TranscriptTermScore = {
  term: RecordId["_id"];
  subjects: Record<string, number | undefined>;
};
