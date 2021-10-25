import { Schema, Model, model, models } from "mongoose";

import { QuestionRecord } from "./Question";

export type ExamRecord<P = false> = {
    date: number;
    duration: number
    SubjectID: string;
    questions: (P extends true ? QuestionRecord<P> : string)[];
} & (P extends true ? { _id: string } : {})

const ExamSchema = new Schema<ExamRecord>({
    duration: {
        type: Number,
        required: [true, 'Exam duration required'],
    }, SubjectID: {
        type: String,
        required: [true, 'Exam subject required'],
    }, date: {
        type: Number,
        required: [true, 'Exam Date required'],
    }, questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question',
    }],
});

export const ExamModel = models.Exam as Model<ExamRecord> ?? model('Exam', ExamSchema);
