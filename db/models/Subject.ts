import { Schema, Model, model, models } from "mongoose";

import type { SubjectRecord, SubjectsRecord } from "types";

const SubjectSchema = new Schema<SubjectRecord>({
  name: {
    type: String,
    required: [true, "Subject name required"],
    unique: true,
    trim: true,
  },
  alias: {
    type: String,
    required: [true, "Subject alias required"],
    unique: true,
    trim: true,
  },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
});

const SubjectsSchema = new Schema<SubjectsRecord>({
  class: {
    type: Schema.Types.ObjectId,
    required: [true, "Class needed"],
    unique: true,
    ref: "Class",
  },
  subjects: [SubjectSchema],
});

export const SubjectsModel =
  (models.Subjects as Model<SubjectsRecord>) ??
  model("Subjects", SubjectsSchema);
