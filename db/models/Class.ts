import { InferSchemaType, Schema, Model, model, models } from "mongoose";

const ClassSchema = new Schema({
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
  resultTemplate: [
    new Schema(
      {
        term: { type: Schema.Types.ObjectId, required: true },
        fields: [
          new Schema({
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
          }),
        ],
        scheme: [
          new Schema(
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
            { _id: false }
          ),
        ],
      },
      { _id: false }
    ),
  ],
});

export const ClassModel = (models.Class as Model<InferSchemaType<typeof ClassSchema>>) ?? model("Class", ClassSchema);
