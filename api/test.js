export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Vercel serverless functions are working!',
    timestamp: new Date().toISOString(),
  })
}
