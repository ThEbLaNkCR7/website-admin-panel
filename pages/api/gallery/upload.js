import formidable from "formidable";
import cloudinary from "../../../lib/cloudinary";
import { connectDB } from "../../../lib/db";
import Gallery from "../../../models/gallery";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  const form = formidable({
    multiples: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST allowed",
    });
  }

  try {
    await connectDB();

    const { fields, files } = await parseForm(req);
    const getField = (field) => (Array.isArray(field) ? field[0] : field);
    const category = getField(fields.category) || "Completed Projects";
    const titlesRaw = getField(fields.titles);
    const titles = titlesRaw ? JSON.parse(titlesRaw) : [];
    const uploadedFiles = Array.isArray(files.files)
      ? files.files
      : [files.files];

    if (!uploadedFiles?.length) {
      return res.status(400).json({
        error: "No files uploaded",
      });
    }

    const filesData = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

      if (!file?.filepath) continue;

      const uploadResult = await cloudinary.uploader.upload(file.filepath, {
        folder: "gallery-files",
        resource_type: "auto",
      });

      const isVideo = file.mimetype?.startsWith("video");

      filesData.push({
        title: titles[i] || file.originalFilename || "Untitled",
        url: uploadResult.secure_url,
        type: isVideo ? "video" : "image",
        createdAt: new Date(),
      });
    }

    const gallery = await Gallery.findOneAndUpdate(
      { category },
      {
        $push: {
          files: {
            $each: filesData,
          },
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      data: gallery,
    });
  } catch (error) {
    console.error("Gallery Upload Error:", error);

    return res.status(500).json({
      error: "Failed to upload files",
    });
  }
}
