import { ExamRecord, QuestionRecord, RecordId } from "types";

export type ExamsPOSTData = RecordId;

export type ExamGETData = RecordId & {
    questions: QuestionRecord[];
    details: Pick<ExamRecord, 'duration' | 'instructions' | 'subjectId'> & {
        name: {
            class: string;
            subject: string;
        };
    };
}

export type ExamPUTData = RecordId;
