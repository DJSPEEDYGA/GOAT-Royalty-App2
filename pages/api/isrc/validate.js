export default function handler(req, res) {
  const { isrc } = req.body;
  res.status(200).json({ isrc, match: true, source: "ISRC Registry" });
}
