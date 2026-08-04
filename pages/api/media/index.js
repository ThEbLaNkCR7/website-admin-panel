import { connectDB } from "../../../lib/db";
import Media from "../../../models/media";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const data = await Media.find().sort({ createdAt: -1 });
    return res.json(data);
  }

  res.status(405).json({ error: "Method not allowed" });
}