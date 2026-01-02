const store = global.store ?? (global.store = new Map());

export default function handler(req, res) {
  const { id } = req.query;
  const e = store.get(id);

  if (!e) {
    return res.status(404).send("Not Found");
  }

  res.setHeader("Content-Type", "text/html");
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta property="og:title" content="${esc(e.title)}">
<meta property="og:description" content="${esc(e.description)}">
${e.image ? `<meta property="og:image" content="${e.image}">` : ""}
<meta name="theme-color" content="#${e.color || "5865F2"}">
<meta property="og:type" content="website">
</head>
<body></body>
</html>
`);
}

function esc(s = "") {
  return s.replace(/"/g, "&quot;");
}
