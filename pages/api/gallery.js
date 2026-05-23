import { connectDB } from "../../lib/db";
import Gallery from "../../models/gallery";

export const config = {
  maxDuration: 10,
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const { category, limit = 50, offset = 0 } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const galleryItems = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    const total = await Gallery.countDocuments(filter);

    // sort files inside each gallery by latest
    const formattedData = galleryItems.map((gallery) => ({
      ...gallery.toObject(),

      files: (gallery.files || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    }));

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120",
    );

    return res.status(200).json({
      success: true,
      data: formattedData,

      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total,
      },
    });
  } catch (error) {
    console.error("Gallery API Error:", error);

    return res.status(500).json({
      error: "Failed to fetch gallery",
    });
  }
}
