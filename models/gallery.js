import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Ongoing Projects", "Completed Projects"],
      required: true,
      unique: true,
    },

    files: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        url: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Gallery ||
  mongoose.model("Gallery", GallerySchema);
