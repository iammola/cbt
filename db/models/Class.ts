import { Schema, Model, model, models } from "mongoose";

import type { ClassRecord } from "types";

const ClassSchema = new Schema<ClassRecord>({
  name: {
    type: String,
    required: [true, "Class name is required"],
    unique: true,
    trim: true,
  },
  alias: {
    type: String,
    required: [true, "Class alias is required"],
    unique: true,
    trim: true,
  },
  resultTemplate: {
    _id: false,
    default: undefined,
    type: [
      {
        session: Schema.Types.ObjectId,
        terms: {
          _id: false,
          type: [
            {
              term: Schema.Types.ObjectId,
              fields: {
                type: [
                  {
                    max: {
                      type: Number,
                      required: [true, "Field max required"],
                      min: [1, "Field max cannot be less than 1"],
                    },
                    name: {
                      type: String,
                      required: [true, "Field name required"],
                    },
                    alias: {
                      type: String,
                      uppercase: true,
                      required: [true, "Field Alias required"],
                    },
                  },
                ],
              },
              scheme: {
                _id: false,
                type: [
                  {
                    limit: {
                      type: Number,
                      min: [1, "Scheme limit cannot be less than 1"],
                      required: [true, "Scheme limit required"],
                    },
                    grade: {
                      type: String,
                      uppercase: true,
                      required: [true, "Scheme grade required"],
                    },
                    description: {
                      type: String,
                      required: [true, "Scheme description required"],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
});

export const ClassModel = (models.Class as Model<ClassRecord>) ?? model("Class", ClassSchema);
