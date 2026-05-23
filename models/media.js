import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Ongoing Projects", "Completed Projects"],
      required: true,
    },

    subCategory: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      default: "",
    },

    client: {
      type: String,
      default: "",
    },

    commencementDate: {
      type: Date,
    },

    finalizationDate: {
      type: Date,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Media || mongoose.model("Media", MediaSchema);