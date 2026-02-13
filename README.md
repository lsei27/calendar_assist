# Kalendář asistent – Chatbot frontend

Moderní chatovací rozhraní pro n8n workflow, které domlouvá schůzky přes Outlook kalendář.

## Rychlý start

1. **Zapněte Chat Trigger** v n8n workflow.

2. **Vercel – nastavte proměnnou prostředí:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Přidejte: `N8N_WEBHOOK_URL` = `https://n8n.couldbe.cz/webhook/f406671e-c954-4691-b39a-66c90aa2f103/chat`
   - Redeploy projektu

3. Frontend volá `/api/chat` (proxy na Vercelu) – žádný CORS.

## Deployment na Vercel

```bash
# Lokálně
npm i -g vercel
vercel

# Nebo push na GitHub a propojte repozitář s Vercel
```

Vercel automaticky rozpozná statický site – žádný build step není potřeba.

## Struktura projektu

```
├── index.html    # Chat UI
├── styles.css    # Styling
├── chat.js       # Logika (fetch, session)
├── config.js     # Webhook URL – upravit před deployem
├── vercel.json   # Konfigurace Vercel
└── README.md
```

## API (n8n webhook)

**Request (POST):**
```json
{
  "sessionId": "uuid-session",
  "chatInput": "zpráva uživatele"
}
```

**Response:**
```json
{
  "output": "odpověď asistenta"
}
```

Pro úvodní zprávu se posílá pouze `sessionId` (bez `chatInput`).
