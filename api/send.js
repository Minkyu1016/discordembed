export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { webhook, title, description, image, color } = req.body;

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title,
        description,
        color: parseInt(color, 16),
        image: image ? { url: image } : undefined
      }]
    })
  });

  res.json({ ok: true });
}
