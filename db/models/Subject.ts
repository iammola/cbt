import { Schema, Model, model, models } from "mongoose";

import type { SubjectRecord } from "types";

const SubjectSchema = new Schema<SubjectRecord>({
    name: {
        type: String,
        required: [true, 'Subject name required'],
        trim: true,
    }, alias: {
        type: String,
        required: [true, 'Subject alias required'],
        trim: true,
    }
});

export const SubjectModel = models.Subject as Model<SubjectRecord> ?? model('Subject', SubjectSchema);
