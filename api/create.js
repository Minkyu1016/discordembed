import crypto from "crypto";

const store = global.store ?? (global.store = new Map());

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  let id;
  do {
    id = crypto.randomBytes(3).toString("base64url");
  } while (store.has(id)); // 중복 방지

  store.set(id, req.body);

  res.json({
    url: `${req.headers.origin}/api/e/${id}`
  });
}

