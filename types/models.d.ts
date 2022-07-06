import type { Types } from "mongoose";

type ObjectId = Types.ObjectId;

type RecordId = { _id: ObjectId };

type ResultGrade = {
  limit: number;
  grade: string;
  description: string;
};

type ResultFields = RecordId & {
  max: number;
  name: string;
  alias: string;
};

/* Class and Subject */

export type ClassRecord = RecordId & {
  name: string;
  alias: string;
  resultTemplate: ClassResultTemplate[];
};

export type ClassResultTemplate = {
  term: ObjectId;
  scheme: ResultGrade[];
  fields: ResultFields[];
};

export type SubjectRecord = RecordId & {
  name: string;
  alias: string;
  teachers: ObjectId[];
};

export type SubjectsRecord<P = false> = RecordId & {
  class: P extends true ? ClassRecord : ObjectId;
  subjects: SubjectRecord[];
};

/* Student and Teacher */

type UserRecord<T = never> = RecordId & {
  name: {
    title: T;
    initials: string;
    full: string;
    first: string;
    last: string;
  };
  image: string;
  email: string;
  code: number;
};

export type TeacherRecord = UserRecord<"Mr." | "Mrs." | "Ms." | "Dr." | "Master">;

export type StudentRecord = UserRecord & {
  birthday: Date;
  gender: "M" | "F";
  academic: {
    term: ObjectId;
    class: ObjectId;
    subjects: ObjectId[];
  }[];
};

/* Event and Exam and Answer */

export type EventRecord<P = false> = RecordId & {
  from: Date;
  exams: (P extends true ? ExamRecord : ObjectId)[];
};

type DateRecord<P = false> = {
  at: Date;
  by: P extends true ? TeacherRecord : ObjectId;
};

export type ExamRecord<P = false> = RecordId & {
  duration: number;
  term: ObjectId;
  subject: P extends true ? SubjectRecord : ObjectId;
  instructions: string[];
  questions: QuestionRecord[];
  created: DateRecord<P>;
  edited: DateRecord<P>[];
};

export type AnswerRecord = RecordId & {
  answer: string;
  isCorrect?: boolean;
};

export type QuestionRecord = RecordId & {
  question: string;
} & (
    | {
        type: "Multiple choice" | "Short Answer" | "Long Answer";
        answers: AnswerRecord[];
      }
    | {
        answers: never;
        type: "Checkboxes";
        maxLength?: number;
        minLength?: number;
      }
  );

export type CBTResultRecord<P = false> = RecordId & {
  student: P extends true ? StudentRecord : ObjectId;
  term: ObjectId;
  results: {
    ended: Date;
    started: Date;
    score: number;
    exam: P extends true ? ExamRecord : ObjectId;
    answers: {
      answer: ObjectId;
      question: ObjectId;
    }[];
  }[];
};

export type ResultRecord = RecordId & {
  term: ObjectId;
  student: ObjectId;
  comments: string;
  data: {
    subject: ObjectId;
    total?: number;
    scores?: {
      score: number;
      field: ObjectId;
    }[];
  }[];
};

/* Session and Term */

export type SessionRecord = RecordId & {
  name: string;
  alias: string;
  current?: boolean;
  terms: TermRecord[];
};

export type TermRecord = RecordId & {
  name: string;
  alias: string;
  current?: boolean;
};

/* Settings */

export type SettingsRecord = RecordId & {
  active?: true;
  transcriptGrade: (ResultGrade & {
    remark: string;
  })[];
};
