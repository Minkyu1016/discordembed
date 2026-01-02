export const config = {
  api: {
    bodyParser: true,
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const body = req.body || {};

  const data = {
    title: body.title || "",
    description: body.description || "",
    image: body.image || "",
    color: /^[0-9a-fA-F]{6}$/.test(body.color)
      ? body.color
      : "5865F2"
  };

  const encoded = Buffer.from(JSON.stringify(data)).toString("base64url");

  res.status(200).json({
    url: `${req.headers.origin}/api/e/${encoded}`
  });
}
