# Kalendář asistent – Chatbot frontend

## Přehled

Frontend pro n8n workflow „Create a branded AI-powered website chatbot“. Chatbot koordinuje schůzky přes Outlook kalendář a komunikuje s klienty v češtině.

## Architektura

```
[Uživatel] → [Vercel] → /api/chat (proxy) → [n8n Webhook] → [AI Agent + Outlook]
```

Proxy `/api/chat` obchází CORS – frontend volá stejnou doménu.

## Soubory

| Soubor | Účel | Řádky |
|--------|------|-------|
| `index.html` | Chat kontejner, zprávy, input | ~80 |
| `styles.css` | Layout, typografie, responsivita | ~200 |
| `chat.js` | Fetch, sessionId, DOM update | ~120 |
| `config.js` | Webhook URL (upravit před deployem) | ~10 |

## n8n Webhook API

**Request (POST):**
```json
{
  "chatInput": "zpráva uživatele",
  "sessionId": "uuid-session"
}
```

**Response:**
```json
{
  "output": "odpověď asistenta"
}
```

## Konfigurace před deployem

1. V n8n zapnout Chat Trigger (pokud je vypnutý)
2. Zkopírovat Webhook URL z nódu Chat Trigger
3. Do `config.js` vložit: `webhookUrl: 'https://...'`
4. V n8n nastavit CORS (Allowed Origin) na Vercel doménu nebo `*`

## Deployment (Vercel)

- Statický site: `vercel` nebo push na GitHub + Vercel integrace
- Žádný build step – čistý HTML/CSS/JS
