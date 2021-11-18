export * from "./models";
export * from "./components";

import { AnswerRecord, ExamRecord, QuestionRecord } from "./models";

export type CreateQuestion = Omit<QuestionRecord, '_id' | 'answers'> & {
    answers: Omit<AnswerRecord, '_id'>[];
};

export type ExamData = {
    _id: string;
    questions: QuestionRecord[];
    details: Pick<ExamRecord, 'duration' | 'instructions' | 'subjectId'> & {
        name: {
            class: string;
            subject: string;
        };
    };
}

export type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];
