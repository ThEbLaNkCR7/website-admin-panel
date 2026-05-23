import { connectDB } from "@/lib/db";
import Gallery from "../../../models/gallery";

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

    // Find and delete the gallery only
    const gallery = await Gallery.findByIdAndDelete(id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    return res.json({
      success: true,
      message: "Gallery deleted successfully",
    });
  } catch (error) {
    console.error("Delete Gallery Error:", error);
    return res.status(500).json({ error: "Failed to delete gallery" });
  }
}
