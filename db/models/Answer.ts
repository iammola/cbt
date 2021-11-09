import { Schema, Model, model, models } from "mongoose";

import type { AnswerRecord, AnswersRecord } from "types";

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

const AnswersSchema = new Schema<AnswersRecord>({
    question: {
        type: Schema.Types.ObjectId,
    }, answers: [AnswerSchema],
});

export const AnswersModel = models.Answers as Model<AnswersRecord> ?? model('Answers', AnswersSchema);
