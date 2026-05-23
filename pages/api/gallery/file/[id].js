import { connectDB } from "../../../../lib/db";
import Gallery from "../../../../models/gallery";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const { id } = req.query;

    await Gallery.updateOne(
      {
        "files._id": id,
      },
      {
        $pull: {
          files: {
            _id: id,
          },
        },
      },
    );

    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
