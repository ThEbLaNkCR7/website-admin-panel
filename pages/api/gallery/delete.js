import { connectDB } from "@/lib/db";
import Gallery from "../../../models/gallery";
import Media from "../../../models/media";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Gallery ID is required" });
    }

    // Find gallery and get media items
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    // Delete associated media items
    if (gallery.mediaItems && gallery.mediaItems.length > 0) {
      await Media.deleteMany({
        _id: { $in: gallery.mediaItems },
      });
    }

    // Delete the gallery
    await Gallery.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Gallery and associated media deleted successfully",
    });
  } catch (error) {
    console.error("Delete Gallery Error:", error);
    return res.status(500).json({ error: "Failed to delete gallery" });
  }
}
