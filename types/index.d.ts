export * from "./models";
export * from "./components";

import { ExamRecord, QuestionRecord } from "./models";

export type CreateQuestion = Omit<QuestionRecord, 'answers'> & {
    answers: Omit<NonNullable<QuestionRecord<true>['answers']>[number], '_id'>[];
};

export type ExamDetails = {
    class: string;
    subject: string;
    details: Pick<ExamRecord, 'duration' | 'SubjectID'>;
}

export type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];
