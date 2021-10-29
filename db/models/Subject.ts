import { Schema, Model, model, models } from "mongoose";

import { SubjectRecord } from "types";

const SubjectSchema = new Schema<SubjectRecord>({
    name: {
        type: String,
        required: [true, 'Subject name required'],
        unique: true,
        trim: true,
    }, alias: {
        type: String,
        required: [true, 'Subject alias required'],
        unique: true,
        trim: true,
    }
});

export const SubjectModel = models.Subject as Model<SubjectRecord> ?? model('Subject', SubjectSchema);
