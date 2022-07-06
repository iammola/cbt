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
    new Schema(
      {
        score: { type: Number, required: true },
        started: { type: Date, required: true },
        ended: { type: Date, required: true },
        exam: {
          type: Schema.Types.ObjectId,
          ref: "Exam",
        },
        answers: {
          default: undefined,
          type: [
            new Schema(
              {
                answer: { type: Schema.Types.ObjectId, required: true },
                question: { type: Schema.Types.ObjectId, required: true },
              },
              { _id: false }
            ),
          ],
        },
      },
      { _id: false }
    ),
  ],
});

export const CBTResultModel = (models.CBTResult as Model<CBTResultRecord>) ?? model("CBTResult", CBTResultSchema);
