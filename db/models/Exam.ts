import { Schema, Model, model, models } from "mongoose";

import type { ExamRecord } from "types";

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
    }], created: {
        _id: false,
        type: {
            at: {
                type: Date,
                required: [true, 'Created at required']
            }, by: {
                type: Schema.Types.ObjectId,
                required: [true, 'Created by required']
            }
        },
    }
});

export const ExamModel = models.Exam as Model<ExamRecord> ?? model('Exam', ExamSchema);
