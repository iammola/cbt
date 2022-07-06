import { isFuture } from "date-fns";
import { InferSchemaType, Schema, Model, model, models } from "mongoose";

const EventSchema = new Schema({
  from: {
    type: Date,
    unique: true,
    required: true,
    validate: [(v: Date) => isFuture(v), "New events must be after the current date"],
  },
  exams: {
    type: [Schema.Types.ObjectId],
    ref: "Exam",
    required: [true, "Event Exam is required"],
  },
});

export const EventModel = (models.Event as Model<InferSchemaType<typeof EventSchema>>) ?? model("Event", EventSchema);
