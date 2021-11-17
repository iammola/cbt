export * from "./models";
export * from "./components";

import { AnswerRecord, ExamRecord, QuestionRecord } from "./models";

export type CreateQuestion<P = false, I = false> = Omit<QuestionRecord<P, I>, 'answers'> & {
    answers: AnswerRecord[];
};

export type ExamData = {
    _id: string;
    questions: QuestionRecord<true>[];
    details: Pick<ExamRecord, 'duration' | 'instructions' | 'subjectId'> & {
        name: {
            class: string;
            subject: string;
        };
    };
}

export type RouteResponse = [boolean, number, string | Record<string, any> & { error?: unknown, message: string }];
