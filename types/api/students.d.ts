import { RecordId, ExamRecord, UserRecord, ResultRecord, StudentRecord, SubjectRecord } from "types";

export type StudentsPOSTData = Pick<UserRecord, 'code'>;

export type StudentResultPOSTData = {
    score: number;
}

export type StudentGETData = StudentRecord | null;

export type StudentCBTResultsGETData = {
    started: Date;
    score: number;
    subject: string;
}[];

export type StudentExamsGETData = (Pick<ExamRecord, '_id' | 'duration'> & {
    date: Date;
    subject: string;
    locked?: boolean;
    questions: number;
})[];

export type StudentExamGETData = RecordId & {
    questions: QuestionRecord[];
    details: Pick<ExamRecord, 'duration' | 'instructions' | 'subjectId'> & {
        name: {
            class: string;
            subject: string;
        };
    };
}

export type StudentResultSubjectGETData = Omit<ResultRecord['data'][number], 'subject'>;

export type StudentResultSubjectPOSTData = {
    ok: boolean;
}

export type StudentCommentGETData = Pick<ResultRecord, 'comments'> | null;

export type StudentCommentPOSTData = { ok: boolean; }

export type StudentSubjectsGETData = Pick<SubjectRecord, "_id" | "name">[];

export type StudentResultGETData = Pick<ResultRecord, 'comments' | 'data'>;
