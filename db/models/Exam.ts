import { Schema, Model, model, models } from "mongoose";

import { QuestionRecord } from "./Question";

export type ExamRecord<P = false> = {
    duration: number;
    SubjectID: P extends true ? string : Schema.Types.ObjectId;
    questions: (P extends true ? QuestionRecord<P> : string)[];
} & (P extends true ? { _id: string } : {})

const ExamSchema = new Schema<ExamRecord>({
    duration: {
        type: Number,
        required: [true, 'Exam duration required'],
    }, SubjectID: {
        type: Schema.Types.ObjectId,
        required: [true, 'Exam subject required'],
    }, questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question',
    }],
});

export const ExamModel = models.Exam as Model<ExamRecord> ?? model('Exam', ExamSchema);
