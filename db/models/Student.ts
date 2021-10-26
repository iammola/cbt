import { Schema, Model, model, models } from "mongoose";

export type SubjectRecord<P = false> = {
    name: {
        initials: string;
        fullName: string;
        firstName: string;
        lastName: string;
    };
    email: string;
    academic: {
        session: Schema.Types.ObjectId;
        terms: {
            term: Schema.Types.ObjectId;
            class: Schema.Types.ObjectId;
            subjects: Schema.Types.ObjectId[];
        }[];
    }[];
} & (P extends true ? { _id: string } : {})

const SubjectSchema = new Schema<SubjectRecord>({
    name: {
        type: {
            initials: {
                type: String,
                trim: true,
                required: [true, 'Initials required']
            }, fullName: {
                type: String,
                trim: true,
                required: [true, 'Full Name required']
            }, firstName: {
                type: String,
                trim: true,
                required: [true, 'First Name required']
            }, lastName: {
                type: String,
                trim: true,
                required: [true, 'Last Name required']
            }
        }
    }, email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Please fill a valid email address']
    }, academic: [{
        type: {
            session: {
                type: Schema.Types.ObjectId,
                required: [true, 'Session required']
            }, terms: [{
                type: {
                    term: {
                        type: Schema.Types.ObjectId
                    }, class: {
                        type: Schema.Types.ObjectId
                    }, subjects: [{
                        type: Schema.Types.ObjectId
                    }]
                }, validate: [(v: SubjectRecord['academic']) => v.every(i => i.terms.length > 0), 'At least one term required']
            }]
        },
    }]
});

export const SubjectModel = models.Subject as Model<SubjectRecord> ?? model('Subject', SubjectSchema);
