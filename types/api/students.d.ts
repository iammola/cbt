import { RecordId, ExamRecord, UserRecord, ResultRecord } from "types";

export type StudentsPOSTData = Pick<UserRecord, 'code'>;

export type StudentResultPOSTData = {
    score: number;
}

export type StudentResultsGETData = {
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

export type StudentResultSubjectGETData = {
    scores: ResultRecord['data'][number]['scores'];
}

export type StudentResultSubjectPOSTData = {
    ok: boolean;
}
