import { Schema, Model, model, models } from "mongoose";

import type { CBTResultRecord } from "types";

const CBTResultSchema = new Schema<CBTResultRecord>({
  student: {
    type: Schema.Types.ObjectId,
    immutable: true,
    ref: "Student",
    required: [true, "Student ID required"],
  },
  term: {
    type: Schema.Types.ObjectId,
    immutable: true,
    required: [true, "Term required"],
  },
  results: [
    {
      _id: false,
      score: Number,
      started: Date,
      ended: Date,
      exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
      answers: [
        {
          default: undefined,
          type: {
            _id: false,
            answer: Schema.Types.ObjectId,
            question: Schema.Types.ObjectId,
          },
        },
      ],
    },
  ],
});

export const CBTResultModel = (models.CBTResult as Model<CBTResultRecord>) ?? model("CBTResult", CBTResultSchema);
