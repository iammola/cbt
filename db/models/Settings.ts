import { Schema, Model, model, models } from "mongoose";

import type { SettingsRecord } from "types";

const SettingsSchema = new Schema<SettingsRecord>({
  active: {
    type: Boolean,
    default: undefined,
  },
  transcriptGrade: {
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
});

export const SettingsModel = (models.Settings as Model<SettingsRecord>) ?? model("Settings", SettingsSchema);
