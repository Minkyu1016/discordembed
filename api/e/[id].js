const esc = (s = "") =>
  s.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));

export default function handler(req, res) {
  const e = global.embeds?.[req.query.id];
  if (!e) return res.status(404).send("Not found");

  const color =
    /^[0-9a-fA-F]{6}$/.test(e.color) ? e.color : "5865F2";

  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta property="og:title" content="${esc(e.title)}">
<meta property="og:description" content="${esc(e.description)}">
<meta property="og:image" content="${e.image || "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico"}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#${color}">
</head>
<body></body>
</html>`);
}
