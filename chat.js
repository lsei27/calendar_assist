/**
 * Chat UI – napojení na n8n webhook
 * Minimální JS, bez frameworků.
 */

(function () {
  const config = window.CHAT_CONFIG || {};
  const webhookUrl = config.webhookUrl;

  if (!webhookUrl) {
    const msg = document.getElementById("messages");
    if (msg) {
      const el = document.createElement("div");
      el.className = "msg msg-error";
      el.textContent = "Nastavte webhookUrl v config.js před použitím.";
      msg.appendChild(el);
    }
    return;
  }

  const STORAGE_KEY = "chat_session_id";

  function getSessionId() {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  function addMessage(text, role, isError) {
    const el = document.createElement("div");
    el.className = "msg msg-" + (role || "bot") + (isError ? " msg-error" : "");
    el.textContent = text; /* textContent = bezpečné proti XSS */
    document.getElementById("messages").appendChild(el);
    el.scrollIntoView({ behavior: "smooth" });
  }

  function removeLoading() {
    const loading = document.querySelector(".msg-loading");
    if (loading) loading.remove();
  }

  function sendMessage(chatInput) {
    const messages = document.getElementById("messages");
    const form = document.getElementById("chatForm");
    const submitBtn = document.getElementById("submitBtn");
    const input = document.getElementById("input");

    const body = {
      sessionId: getSessionId(),
    };
    if (chatInput) body.chatInput = String(chatInput).trim();

    submitBtn.disabled = true;
    if (chatInput) {
      addMessage(String(chatInput).trim(), "user");
      input.value = "";
      const loading = document.createElement("div");
      loading.className = "msg msg-loading";
      loading.textContent = "Čekám na odpověď…";
      messages.appendChild(loading);
      loading.scrollIntoView({ behavior: "smooth" });
    }

    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Chyba sítě: " + res.status);
        return res.json();
      })
      .then(function (data) {
        removeLoading();
        const output = data && (data.output ?? data.text);
        if (typeof output === "string") {
          addMessage(output, "bot");
        } else {
          addMessage("Nepodařilo se zpracovat odpověď.", "bot", true);
        }
      })
      .catch(function (err) {
        removeLoading();
        addMessage(
          "Nepodařilo se odeslat zprávu. Zkontrolujte připojení a webhook URL.",
          "bot",
          true
        );
        console.error(err);
      })
      .finally(function () {
        submitBtn.disabled = false;
        input.focus();
      });
  }

  document.getElementById("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("input");
    const text = input.value.trim();
    if (!text) return;
    sendMessage(text);
  });

  document.getElementById("input").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.form.dispatchEvent(new Event("submit"));
    }
  });

  addMessage(
    "Ahoj! Napište nám zprávu a zjistěte dostupnost. Rád vám pomohu najít vhodný termín pro úvodní konzultaci.",
    "bot"
  );
})();
