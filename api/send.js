export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    webhook,
    mode,

    // 기존 UI 필드들
    message,        // Message content
    title,
    description,
    color,
    image           // Embed image URL → reply 모드에선 Message URL로 사용
  } = req.body;

  if (!webhook || !mode) {
    return res.status(400).json({ error: "Missing webhook or mode" });
  }

  let payload;

  // Discord 메시지 URL 파싱
  function parseDiscordMessageUrl(url) {
    const match = url?.match(
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
    // 👇 UI 변경 없이 재활용
    // message  -> 답장 내용
    // image    -> 메시지 URL
    const parsed = parseDiscordMessageUrl(image);

    if (!parsed) {
      return res.status(400).json({
        error: "Reply mode requires Discord message URL in 'Embed image URL' field"
      });
    }

    payload = {
      content: message,
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
