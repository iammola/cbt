import { Schema, Model, model, models } from "mongoose";

import type { AnswerRecord } from "types";

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

export const AnswerModel = models.Answer as Model<AnswerRecord> ?? model('Answer', AnswerSchema);
const AnswersSchema = new Schema<AnswersRecord>({
    question: {
        type: Schema.Types.ObjectId,
    }, answers: [AnswerSchema],
});
