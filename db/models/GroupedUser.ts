import { InferSchemaType, model, models, Model, Schema } from "mongoose";

const GroupedUserSchema = new Schema({
  name: {
    initials: {
      type: String,
      required: true,
    },
    full: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
    unique: true,
    select: false,
  },
});

export const GroupedUserModel =
  (models.GroupedUser as Model<InferSchemaType<typeof GroupedUserSchema>>) ?? model("GroupedUser", GroupedUserSchema);
