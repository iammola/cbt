import { Schema, Model, model, models } from "mongoose";

export type StudentRecord<P = false> = {
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

const StudentSchema = new Schema<StudentRecord>({
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
        },
        _id: false,
    }, email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Please fill a valid email address']
    }, academic: [{
        type: {
            _id: false,
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
                }, validate: [(v: StudentRecord['academic']) => v.every(i => i.terms.length > 0), 'At least one term required'],
                _id: false,
            }]
        },
    }]
});

export const StudentModel = models.Student as Model<StudentRecord> ?? model('Student', StudentSchema);
