import { RecordId, UserRecord } from "types";

export type StudentsPOSTData = Pick<UserRecord, 'code'>;

export type StudentResultPOSTData = {
    score: number;
}

export type StudentExamGETData = RecordId & {
    questions: QuestionRecord[];
    details: Pick<ExamRecord, 'duration' | 'instructions' | 'subjectId'> & {
        name: {
            class: string;
            subject: string;
        };
    };
}
