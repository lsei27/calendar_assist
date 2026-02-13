/**
 * Konfigurace
 * – Produkce (Vercel): použije /api/chat (proxy, žádný CORS)
 * – Lokálně: můžete nastavit přímo n8n URL pro testování
 */
window.CHAT_CONFIG = {
  webhookUrl: "/api/chat",
};
