export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const id = Math.random().toString(36).slice(2, 6);

  global.embeds ||= {};
  global.embeds[id] = req.body;

  res.json({
    url: `${req.headers.origin}/api/e/${id}`
  });
}
