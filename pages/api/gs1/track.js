export default function handler(req, res) {
  const { gs1 } = req.body;
  res.status(200).json({ gs1, product: "GOAT Merch", royalties: "$1,223" });
}
