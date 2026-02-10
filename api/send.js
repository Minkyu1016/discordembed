export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    webhook,
    mode,
    title,
    description,
    image,
    color,
    message,
    replyUrl,
    replyMessage
  } = req.body;

  let payload;

  if (mode === "message") {
    payload = { content: message };
  }

  else if (mode === "reply") {
    // 메시지 URL 파싱
    // https://discord.com/channels/GUILD/CHANNEL/MESSAGE
    const parts = replyUrl.split("/");
    const channel_id = parts.at(-2);
    const message_id = parts.at(-1);

    payload = {
      content: replyMessage,
      message_reference: {
        channel_id,
        message_id
      }
    };
  }

  else {
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
