import { Schema, Model, model, models } from "mongoose";

export type TeacherRecord<P = false> = {
    name: {
        title: "Mr." | "Mrs." | "Ms." | "Dr." | "Master";
        initials: string;
        fullName: string;
        firstName: string;
        lastName: string;
    };
    email: string;
    subjects: Schema.Types.ObjectId[];
} & (P extends true ? { _id: string } : {})

const TeacherSchema = new Schema<TeacherRecord>({
    name: {
        type: {
            title: {
                type: String,
                enum: {
                    values: ["Mr.", "Mrs.", "Ms.", "Dr.", "Master"],
                    message: "Invalid title"
                }, required: [true, 'Title required']
            }, initials: {
                type: String,
                trim: true,
                uppercase: true,
                minlength: [2, 'Initials min-length is 2'],
                maxlength: [3, 'Initials max-length is 3'],
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
    }, subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }]
});

export const TeacherModel = models.Teacher as Model<TeacherRecord> ?? model('Teacher', TeacherSchema);
