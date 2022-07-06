import { InferSchemaType, Schema, Model, model, models } from "mongoose";

const SessionSchema = new Schema({
  name: {
    type: String,
    required: [true, "Session name is required"],
    unique: true,
    trim: true,
  },
  alias: {
    type: String,
    required: [true, "Session alias is required"],
    unique: true,
    trim: true,
  },
  current: {
    type: Boolean,
    default: undefined,
    set: (e?: boolean) => (e === false ? undefined : true),
  },
  terms: {
    type: [
      new Schema({
        name: {
          type: String,
          trim: true,
          required: true,
        },
        alias: {
          type: String,
          trim: true,
          required: true,
        },
        current: {
          type: Boolean,
          default: undefined,
          set: (e?: boolean) => (!e ? undefined : true),
        },
      }),
    ],
  },
});

export const SessionModel =
  (models.Session as Model<InferSchemaType<typeof SessionSchema>>) ?? model("Session", SessionSchema);
