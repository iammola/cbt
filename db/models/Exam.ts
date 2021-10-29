import { Schema, Model, model, models } from "mongoose";

import { ExamRecord } from "types";

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
