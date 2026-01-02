export const config = {
  api: { bodyParser: true }
};

function encode(data) {
  return Buffer.from(JSON.stringify(data)).toString("base64url");
}

function decode(str) {
  return JSON.parse(Buffer.from(str, "base64url").toString());
}

export default function handler(req, res) {
  // CREATE
  if (req.method === "POST") {
    const body = req.body || {};

    const content = {
      title: body.title || "",
      author: body.author || "",
      description: body.description || "",
      image: body.image || "",
      thumbImage: !!body.thumbImage,
      video: body.video || "",
      color: /^[0-9a-fA-F]{6}$/.test(body.color) ? body.color : "5865F2"
    };

    const id = encode(content);

    return res.status(200).json({
      status: 200,
      message: "Embed created",
      data: {
        id,
        removed: false,
        content
      }
    });
  }

  // GET
  if (req.method === "GET") {
    try {
      const id = req.query.id;
      const content = decode(id);

      return res.status(200).json({
        status: 200,
        message: "OK",
        data: {
          id,
          removed: false,
          content
        }
      });
    } catch {
      return res.status(404).json({
        status: 404,
        message: "Not found",
        data: null
      });
    }
  }

  res.status(405).end();
}
