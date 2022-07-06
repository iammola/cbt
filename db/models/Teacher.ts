import { InferSchemaType, Schema, Model, model, models } from "mongoose";

const TeacherSchema = new Schema({
  name: {
    required: true,
    type: new Schema(
      {
        title: {
          type: String,
          enum: {
            values: ["Mr.", "Mrs.", "Ms.", "Dr.", "Master"],
            message: "Invalid title",
          },
          required: [true, "Title required"],
        },
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
      { _id: false }
    ),
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, "Please fill a valid email address"],
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

export const TeacherModel =
  (models.Teacher as Model<InferSchemaType<typeof TeacherSchema>>) ?? model("Teacher", TeacherSchema);
