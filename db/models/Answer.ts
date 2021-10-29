import { Schema, Model, model, models } from "mongoose";


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
