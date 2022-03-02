import { Schema, Model, model, models } from "mongoose";

import type { AnswerRecord, ExamRecord, QuestionRecord } from "types";

const DateSchema = new Schema<ExamRecord['created']>({
    at: {
        type: Date,
        required: true
    }, by: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    }
}, { _id: false });

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
    }, answers: [{
        type: AnswerSchema,
        required: [function (this: QuestionRecord) {
            return ["Multiple choice", "Checkboxes"].includes(this.type);
        }, "Multiple choice and Checkboxes questions require answers"],
        validate: [function (this: QuestionRecord) {
            return ["Multiple choice", "Checkboxes"].includes(this.type) ? ((this.answers ?? []).length) > 1 : this.answers === undefined
        }, "Invalid answer value"],
    }], minLength: {
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
    /*
        min: { type: Number, default: undefined },
        max: { type: Number, required: [function (this: QuestionRecord) { return this.type === "Checkboxes"; }, 'Checkbox Questions require a max-length'], },
    */
});

const ExamSchema = new Schema<ExamRecord>({
    duration: {
        type: Number,
        required: [true, 'Exam duration required'],
    }, termId: {
        type: Schema.Types.ObjectId,
        required: [true, "Exam term required"],
    }, subjectId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Exam subject required'],
    }, instructions: [{
        type: String,
        trim: true,
    }],
    created: DateSchema,
    edited: {
        type: [DateSchema],
        default: undefined
    },
    questions: [QuestionSchema],
});

export const ExamModel = models.Exam as Model<ExamRecord> ?? model('Exam', ExamSchema);
