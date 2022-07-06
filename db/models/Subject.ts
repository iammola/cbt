import { InferSchemaType, Schema, Model, model, models } from "mongoose";

const SubjectSchema = new Schema({
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
  teachers: {
    type: [Schema.Types.ObjectId],
    ref: "Teacher",
    default: undefined,
  },
});

const SubjectsSchema = new Schema({
  class: {
    type: Schema.Types.ObjectId,
    required: [true, "Class needed"],
    unique: true,
    ref: "Class",
  },
  subjects: { type: [SubjectSchema], required: true },
});

export const SubjectsModel =
  (models.Subjects as Model<InferSchemaType<typeof SubjectsSchema>>) ?? model("Subjects", SubjectsSchema);
