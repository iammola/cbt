import { Schema, Model, model, models } from "mongoose";

import type { ExamRecord } from "types";

const ExamSchema = new Schema<ExamRecord>({
    duration: {
        type: Number,
        required: [true, 'Exam duration required'],
    }, SubjectID: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Exam subject required'],
    }, instructions: [{
        type: String,
        trim: true,
    }], created: {
        _id: false,
        type: {
            at: {
                type: Date,
                required: [true, 'Created at required']
            }, by: {
                type: Schema.Types.ObjectId,
                ref: 'Teacher',
                required: [true, 'Created by required']
            }
        },
    }
});

export const ExamModel = models.Exam as Model<ExamRecord> ?? model('Exam', ExamSchema);
