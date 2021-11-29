import { Schema, Model, model, models } from "mongoose";

import type { ResultRecord } from "types";

const ResultSchema = new Schema<ResultRecord>({
    student: {
        type: Schema.Types.ObjectId,
        unique: true,
        ref: 'Student',
        required: [true, "Student ID required"]
    }, results: [{
        _id: false,
        type: {
            score: Number,
            started: Date,
            ended: Date,
            examId: {
                type: Schema.Types.ObjectId,
                ref: 'Exam',
            }, answers: [{
                _id: false,
                default: undefined,
                type: {
                    answer: Schema.Types.ObjectId,
                    question: Schema.Types.ObjectId
                },
            }]
        }
    }]
});

export const ResultModel = models.Result as Model<ResultRecord> ?? model('Result', ResultSchema);
