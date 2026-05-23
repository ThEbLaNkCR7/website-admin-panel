import formidable from "formidable";
import cloudinary from "../../lib/cloudinary";
import { connectDB } from "../../lib/db";
import Media from "../../models/media";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    await connectDB();

    const { fields, files } = await parseForm(req);

    // ✅ File handling
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !file.filepath) {
      return res.status(400).json({
        error: "File missing or invalid",
      });
    }

    // ✅ Normalize fields (formidable returns string | string[])
    const getField = (field) => (Array.isArray(field) ? field[0] : field);

    const title = getField(fields.title) || "Untitled";

    // ✅ NEW FIELDS
    const projectId = getField(fields.projectId) || `proj_${Date.now()}`; // fallback unique id

    const category = getField(fields.category) || "Completed Projects";

    const subCategoryRaw = getField(fields.subCategory);

    const subCategory = subCategoryRaw
      ? Array.isArray(subCategoryRaw)
        ? subCategoryRaw
        : [subCategoryRaw]
      : [];

    const location = getField(fields.location) || "";
    const client = getField(fields.client) || "";
    const description = getField(fields.description) || "";

    const commencementRaw = getField(fields.commencementDate);
    const finalizationRaw = getField(fields.finalizationDate);

    const commencementDate = commencementRaw ? new Date(commencementRaw) : null;

    const finalizationDate = finalizationRaw ? new Date(finalizationRaw) : null;

    console.log("FIELDS RECEIVED:", fields);

    const result = await cloudinary.uploader.upload(file.filepath, {
      resource_type: "auto",
    });

    const media = await Media.create({
      projectId,
      url: result.secure_url,
      type: result.resource_type,
      title,
      category,
      subCategory,
      location,
      client,
      commencementDate,
      finalizationDate,
      description,
    });

    return res.status(200).json(media);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      error: error.message || "Upload failed",
    });
  }
}
