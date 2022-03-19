import { Schema, Model, model, models } from "mongoose";

import type { StudentRecord } from "types";

const StudentSchema = new Schema<StudentRecord>({
  name: {
    _id: false,
    initials: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: [2, "Initials min-length is 2"],
      maxlength: [3, "Initials max-length is 3"],
      required: [true, "Initials required"],
    },
    full: {
      type: String,
      trim: true,
      required: [true, "Full Name required"],
    },
    first: {
      type: String,
      trim: true,
      required: [true, "First Name required"],
    },
    last: {
      type: String,
      trim: true,
      required: [true, "Last Name required"],
    },
  },
  birthday: {
    type: Date,
    required: [true, "Student birthday required"],
  },
  gender: {
    type: String,
    enum: ["M", "F"],
    required: [true, "Student gender required"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, "Please fill a valid email address"],
  },
  academic: {
    _id: false,
    type: [
      {
        term: {
          type: Schema.Types.ObjectId,
          required: [true, "Term ID required"],
        },
        class: {
          type: Schema.Types.ObjectId,
          required: [true, "Class ID required"],
        },
        subjects: {
          type: [Schema.Types.ObjectId],
          required: [true, "Subject IDs required"],
        },
      },
    ],
  },
  code: {
    type: Number,
    required: [true, "User Login Code required"],
    unique: true,
    select: false,
  },
  image: {
    type: String,
    trim: true,
  },
});

export const StudentModel = (models.Student as Model<StudentRecord>) ?? model("Student", StudentSchema);
