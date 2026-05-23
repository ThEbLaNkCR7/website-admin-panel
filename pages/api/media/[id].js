import cloudinary from "../../../lib/cloudinary";
import { connectDB } from "../../../lib/db";
import Media from "../../../models/media";
export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query; // this is projectId now

  // UPDATE (by projectId)
  if (req.method === "PUT") {
    const { title } = req.body;

    const updated = await Media.findOneAndUpdate(
      { projectId: id },
      { title },
      { new: true },
    );

    return res.json(updated);
  }

  // DELETE (by projectId)
  if (req.method === "DELETE") {
    const media = await Media.findOne({ projectId: id });

    if (!media) {
      return res.status(404).json({ error: "Not found" });
    }

    try {
      // 🔥 derive Cloudinary public_id from URL
      const urlParts = media.url.split("/");

      const fileWithExt = urlParts[urlParts.length - 1]; // image.jpg
      const folder = urlParts[urlParts.length - 2]; // folder name

      const public_id = `${folder}/${fileWithExt.split(".")[0]}`;

      await cloudinary.uploader.destroy(public_id, {
        resource_type: media.type || "image",
      });
    } catch (err) {
      console.log("Cloudinary delete failed:", err.message);
    }

    await Media.findOneAndDelete({ projectId: id });

    return res.json({ message: "Deleted successfully" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
