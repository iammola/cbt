export * from "./models";
export * from "./components";

import { AnswersRecord, ExamRecord, QuestionRecord } from "./models";

export type CreateQuestion = QuestionRecord & {
    answers: Omit<AnswersRecord<true>['answers'][number], '_id'>[];
};

export type ExamDetails = {
    class: string;
    subject: string;
    details: Pick<ExamRecord, 'duration' | 'SubjectID'>;
}

export type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];
