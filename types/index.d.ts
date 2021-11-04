export * from "./models";
export * from "./components";

import { QuestionRecord } from "./models";

export type CreateQuestion = Omit<QuestionRecord, 'answers'> & {
    answers: Omit<NonNullable<QuestionRecord<true>['answers']>[number], '_id'>[];
};

export type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];
