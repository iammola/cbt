export * from "./models";
export * from "./components";

import { AnswerRecord, ExamRecord, QuestionRecord } from "./models";

export type CreateQuestion<P = false, I = false> = QuestionRecord<P, I> & {
    answers: AnswerRecord<P, I>[];
};

export type ExamDetails = {
    class: string;
    subject: string;
    details: Pick<ExamRecord, 'duration' | 'SubjectID'>;
}

export type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];
