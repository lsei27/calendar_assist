# Kalendář asistent – Chatbot frontend

Moderní chatovací rozhraní pro n8n workflow, které domlouvá schůzky přes Outlook kalendář.

## Rychlý start

1. **Nastavte webhook URL** v souboru `config.js`:
   ```javascript
   webhookUrl: "https://VASE-N8N-DOMENA/webhook/VAŠE-CESTA",
   ```
   URL získáte v n8n v uzlu **Chat Trigger** (pole **Chat URL**).

2. **Zapněte Chat Trigger** v n8n workflow (pokud je vypnutý).

3. **CORS**: V n8n Chat Trigger → Options → Allowed Origin nastavte vaši doménu nebo `*` pro testování.

4. Otevřete `index.html` v prohlížeči nebo nasaďte na Vercel.

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
