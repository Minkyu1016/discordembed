export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    webhook,
    mode,
    message,
    title,
    description,
    color,
    image,
    replyUrl,
    replyMessage
  } = req.body;

  if (!webhook || !mode) {
    return res.status(400).json({ error: "Missing webhook or mode" });
  }

  let payload;

  function parseDiscordMessageUrl(url) {
    const match = url.match(
      /https:\/\/discord\.com\/channels\/\d+\/(\d+)\/(\d+)/
    );
    if (!match) return null;

    return {
      channelId: match[1],
      messageId: match[2]
    };
  }

  if (mode === "message") {
    payload = {
      content: message
    };

  } else if (mode === "embed") {
    payload = {
      embeds: [{
        title,
        description,
        color: parseInt(color || "5865F2", 16),
        image: image ? { url: image } : undefined
      }]
    };

  } else if (mode === "reply") {
    const parsed = parseDiscordMessageUrl(replyUrl);

    if (!parsed) {
      return res.status(400).json({ error: "Invalid Discord message URL" });
    }

    payload = {
      content: replyMessage,
      message_reference: {
        message_id: parsed.messageId,
        channel_id: parsed.channelId
      }
    };

  } else {
    return res.status(400).json({ error: "Invalid mode" });
  }

  try {
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ error: text });
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
