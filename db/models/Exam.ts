import { Schema, Model, model, models } from "mongoose";

import type { AnswerRecord, ExamRecord, QuestionRecord } from "types";

const AnswerSchema = new Schema<AnswerRecord>({
    isCorrect: {
        type: Boolean,
        default: undefined
    }, answer: {
        type: String,
        trim: true,
        required: [true, "Answer required"],
    }
});

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

const DateSchema = new Schema<ExamRecord['created']>({
    at: {
        type: Date,
        required: true
    }, by: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    }
}, { _id: false })

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
    }],
    created: DateSchema,
    edited: [DateSchema],
    questions: [QuestionSchema],
});

export const ExamModel = models.Exam as Model<ExamRecord> ?? model('Exam', ExamSchema);
