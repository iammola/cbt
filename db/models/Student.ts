import { Schema, Model, model, models } from "mongoose";


const StudentSchema = new Schema<StudentRecord>({
    name: {
        type: {
            initials: {
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
    }], code: {
        type: String,
        required: [true, 'User Login Code required'],
        unique: true,
        select: false,
    }
});

export const StudentModel = models.Student as Model<StudentRecord> ?? model('Student', StudentSchema);
