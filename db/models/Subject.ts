import { Schema, Model, model, models } from "mongoose";

export type SubjectRecord<P = false> = {
    name: string;
    alias: string;
} & (P extends true ? { _id: string } : {})

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
