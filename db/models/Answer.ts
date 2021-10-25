import { Schema, Model, model, models } from "mongoose";

export type AnswerRecord<P = false> = {
    isCorrect?: boolean;
    answer: string
} & (P extends true ? { _id: string } : {})

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
