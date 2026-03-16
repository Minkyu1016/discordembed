export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    webhook,
    mode,
    title,
    description,
    image,
    color,
    message
  } = req.body;

  let payload;

  if (mode === "message") {
    payload = {
      content: message
    };
  } else {
    payload = {
      embeds: [{
        title,
        description,
        color: parseInt(color, 16),
        image: image ? { url: image } : undefined
      }]
    };
  }

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  res.json({ ok: true });
}
