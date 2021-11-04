import { Schema, Model, model, models } from "mongoose";

import type { QuestionRecord } from "types";

const QuestionSchema = new Schema<QuestionRecord>({
    question: {
        type: String,
        trim: true,
        required: [true, 'Question required'],
    }, min: {
        type: Number,
        default: undefined,
    }, max: {
        type: Number,
        required: [function (this: QuestionRecord) {
            return this.type === "Checkboxes";
        }, 'Checkbox Questions require a max-length'],
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
    }, answers: [{
        type: [Schema.Types.ObjectId],
        required: [function (this: QuestionRecord) {
            return ["Multiple choice", "Checkboxes"].includes(this.type)
        }, "Multiple choice and Checkboxes questions require answers"],
        validate: [function (this: QuestionRecord) {
            return ["Multiple choice", "Checkboxes"].includes(this.type) ? ((this.answers ?? []).length) > 1 : this.answers === undefined
        }, "Invalid answer value"],
        ref: "Answer"
    }]
});

export const QuestionModel = models.Question as Model<QuestionRecord> ?? model('Question', QuestionSchema);
