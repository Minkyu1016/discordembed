export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const data = {
    title: req.body.title || "",
    description: req.body.description || "",
    image: req.body.image || "",
    color: /^[0-9a-fA-F]{6}$/.test(req.body.color)
      ? req.body.color
      : "5865F2"
  };

  const encoded = Buffer.from(JSON.stringify(data))
    .toString("base64url");

  res.json({
    url: `${req.headers.origin}/api/e/${encoded}`
  });
}
