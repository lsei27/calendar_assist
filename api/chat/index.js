/**
 * Proxy pro n8n webhook – obchází CORS.
 * Nastavte N8N_WEBHOOK_URL v proměnných prostředí Vercel.
 */

const N8N_URL = process.env.N8N_WEBHOOK_URL;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!N8N_URL) {
    return res.status(200).json({
      output: "Chybí konfigurace N8N_WEBHOOK_URL na serveru.",
    });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const response = await fetch(N8N_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: body.sessionId,
        chatInput: body.chatInput,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[api/chat] n8n returned", response.status, data);
      return res.status(200).json({
        output:
          "Asistent momentálně není dostupný (chyba " +
          response.status +
          "). Zkuste to za chvíli.",
      });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("[api/chat]", err);
    res.status(200).json({
      output: "Nepodařilo se spojit s asistentem. Zkuste to později.",
    });
  }
};
