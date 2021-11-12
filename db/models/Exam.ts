import { Schema, Model, model, models } from "mongoose";

import type { ExamRecord, QuestionRecord } from "types";

const QuestionSchema = new Schema<QuestionRecord>({
    question: {
        type: String,
        trim: true,
        required: [true, 'Question required'],
    }, minLength: {
        type: Number,
        required: [function (this: QuestionRecord) {
            return this.type === "Long Answer";
        }, "Long Answer Questions require a minimum length"]
    }, maxLength: {
        type: Number,
        default: undefined,
    }, type: {
        type: String,
        required: [true, "Question type required"],
        enum: {
            message: "Invalid Question type",
            values: ["Multiple choice", "Checkboxes", "Short Answer", "Long Answer"]
        }
    },
});

const ExamSchema = new Schema<ExamRecord>({
    duration: {
        type: Number,
        required: [true, 'Exam duration required'],
    }, SubjectID: {
        type: Schema.Types.ObjectId,
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
