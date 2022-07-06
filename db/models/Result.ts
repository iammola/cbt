import { InferSchemaType, Schema, Model, model, models } from "mongoose";

const ResultSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    immutable: true,
    ref: "Student",
    required: [true, "Student ID required"],
  },
  data: {
    type: [
      new Schema(
        {
          subject: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          scores: {
            _id: false,
            default: undefined,
            type: [
              new Schema(
                {
                  field: {
                    type: Schema.Types.ObjectId,
                    required: true,
                  },
                  score: {
                    min: 0,
                    required: true,
                    type: Number,
                  },
                },
                { _id: false }
              ),
            ],
          },
          total: {
            type: Number,
            default: undefined,
          },
        },
        { _id: false }
      ),
    ],
  },
  comments: {
    type: String,
    trim: true,
  },
  term: {
    type: Schema.Types.ObjectId,
    immutable: true,
    required: [true, "Result term required"],
  },
});

export const ResultModel =
  (models.Result as Model<InferSchemaType<typeof ResultSchema>>) ?? model("Result", ResultSchema);
