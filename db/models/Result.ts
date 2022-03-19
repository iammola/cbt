import { Schema, Model, model, models } from "mongoose";

import type { ResultRecord } from "types";

const ResultSchema = new Schema<ResultRecord>({
  student: {
    type: Schema.Types.ObjectId,
    immutable: true,
    ref: "Student",
    required: [true, "Student ID required"],
  },
  data: {
    _id: false,
    type: [
      {
        subject: {
          type: Schema.Types.ObjectId,
        },
        scores: {
          _id: false,
          default: undefined,
          type: [
            {
              fieldId: {
                type: Schema.Types.ObjectId,
              },
              score: {
                min: 0,
                type: Number,
              },
            },
          ],
        },
        total: {
          type: Number,
          default: undefined,
        },
      },
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

export const ResultModel = (models.Result as Model<ResultRecord>) ?? model("Result", ResultSchema);
