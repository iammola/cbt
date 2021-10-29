import { Schema, Model, model, models } from "mongoose";

import { ClassRecord } from "types";

const ClassSchema = new Schema<ClassRecord>({
    name: {
        type: String,
        required: [true, 'Class name is required'],
        unique: true,
        trim: true,
    }, alias: {
        type: String,
        required: [true, 'Class alias is required'],
        unique: true,
        trim: true,
    }, subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject',
    }],
});

export const ClassModel = models.Class as Model<ClassRecord> ?? model('Class', ClassSchema);
