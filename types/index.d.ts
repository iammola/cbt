export * from "./models";
export * from "./components";

import { AnswerRecord, ExamRecord, QuestionRecord } from "./models";

export type CreateQuestion = Omit<QuestionRecord, "_id" | "answers"> & {
  answers: Omit<AnswerRecord, "_id">[];
};

export type RouteData<D> = {
  data: D;
  message: string;
};

export type RouteError<E extends object = {}> = E & {
  error: string;
  message: string;
};

export type ClientResponse<D, E extends object = {}> =
  | (RouteData<D> & {
      success: true;
    })
  | (RouteError<E> & {
      success: false;
    });

export type ServerResponse<D, E extends object = {}> = [boolean, number, string | RouteData<D> | RouteError<E>];
