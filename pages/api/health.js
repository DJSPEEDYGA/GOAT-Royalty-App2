export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'GOAT Royalty App API is running',
    timestamp: new Date().toISOString()
  });
}