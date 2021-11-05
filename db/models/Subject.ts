import { Schema, Model, model, models } from "mongoose";

import type { SubjectRecord } from "types";

const SubjectSchema = new Schema<SubjectRecord>({
    class: {
        type: Schema.Types.ObjectId,
        required: [true, 'Class needed'],
        unique: true,
    }, subjects: {
        type: [{
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
            }, teachers: [{
                type: Schema.Types.ObjectId,
                ref: 'Teacher',
            }]
        }]
    }
});

export const SubjectModel = models.Subject as Model<SubjectRecord> ?? model('Subject', SubjectSchema);
