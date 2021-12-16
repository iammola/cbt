import { Schema, Model, model, models } from "mongoose";

import type { ResultRecord } from "types";

const ResultSchema = new Schema<ResultRecord>({
    student: {
        type: Schema.Types.ObjectId,
        unique: true,
        ref: 'Student',
        required: [true, "Student ID required"]
    }, data: {
        _id: false,
        validate: [(val: ResultRecord['data'][number]) => val.scores !== val.total || (val.scores !== undefined && val.total !== undefined), "One of forced total or scores must be provided"],
        type: [{
            subject: {
                type: Schema.Types.ObjectId
            }, scores: {
                _id: false,
                default: undefined,
                type: [{
                    fieldId: {
                        type: Schema.Types.ObjectId
                    }, score: {
                        min: 0,
                        type: Number,
                    }
                }],
            }, total: {
                type: Number,
                default: undefined
            }
        }],
    }, comments: {
        type: String,
        trim: true,
    }
});

export const ResultModel = models.Result as Model<ResultRecord> ?? model('Result', ResultSchema);
