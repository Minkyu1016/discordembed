const esc = (s = "") =>
  s.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));

export default function handler(req, res) {
  let data;

  try {
    data = JSON.parse(
      Buffer.from(req.query.id, "base64url").toString()
    );
  } catch {
    return res.status(400).send("Invalid embed");
  }

  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta property="og:title" content="${esc(data.title)}">
<meta property="og:description" content="${esc(data.description)}">
<meta property="og:image" content="${data.image || "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico"}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#${data.color || "5865F2"}">
</head>
<body></body>
</html>`);
}
