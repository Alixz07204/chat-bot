// Pequeno motor de respostas baseado em palavras-chave
const rules = [
  {
    match: /^(oi|olá|bom dia|boa tarde|boa noite)\b/i,
    reply: () => "Oi! Sou seu assistente. Posso responder dúvidas, dar dicas, ou guiar você por menus."
  },
  {
    match: /\b(menu|opções|ajuda)\b/i,
    reply: () => [
      "Aqui vai o menu:",
      "1) Sobre o projeto",
      "2) Dicas rápidas",
      "3) Contato",
      "4) Reiniciar conversa"
    ].join("\n")
  },
  {
    match: /^\s*1\s*$/,
    reply: () => "Este é um chatbot front-end em HTML/CSS/JS, com respostas simples e estado de digitação."
  },
  {
    match: /^\s*2\s*$/,
    reply: () => [
      "Dicas:",
      "• Use perguntas claras.",
      "• Se não entender, tente outra formulação.",
      "• Peça exemplos quando precisar."
    ].join("\n")
  },
  {
    match: /^\s*3\s*$/,
    reply: () => "Você pode adaptar este bot e integrá-lo a um backend/API. Quer que eu te mostre como?"
  },
  {
    match: /^\s*4\s*$/,
    reply: () => "Conversa reiniciada. Me diga: o que você quer fazer agora?"
  }
];

// Resposta padrão quando não há regra
function defaultReply(text) {
  return `Entendi: "${text}". Posso te mostrar o menu (digite 'menu') ou tentar responder algo específico.`;
}

// Utilitários
function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function el(id) { return document.getElementById(id); }
function tpl(id) { return document.getElementById(id).content.cloneNode(true); }

function appendMessage(type, text) {
  const chat = el("chat");
  const node = tpl(type === "user" ? "msg-user" : "msg-bot");
  node.querySelector(".bubble").textContent = text;
  node.querySelector(".time").textContent = nowTime();
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const chat = el("chat");
  const node = tpl("typing");
  node.firstElementChild.dataset.typing = "true";
  chat.appendChild(node);
  chat.scrollTop = chat.scrollHeight;
  return node.firstElementChild;
}

function hideTyping(typingNode) {
  typingNode?.parentElement?.remove();
}

// Motor principal
function getBotReply(userText) {
  const normalized = userText.trim();
  for (const rule of rules) {
    if (rule.match.test(normalized)) {
      const r = rule.reply(normalized);
      return Array.isArray(r) ? r.join("\n") : r;
    }
  }
  return defaultReply(normalized);
}

// Inicialização
function init() {
  const chat = el("chat");
  appendMessage("bot", "Olá! Sou seu assistente. Digite 'menu' para ver opções.");
  const form = el("chat-form");
  const input = el("message-input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value;
    if (!text.trim()) return;

    appendMessage("user", text);
    input.value = "";

    const typing = showTyping();
    // Simula processamento
    setTimeout(() => {
      const reply = getBotReply(text);
      hideTyping(typing);
      appendMessage("bot", reply);
    }, 600 + Math.min(text.length * 20, 1200));
  });
}

document.addEventListener("DOMContentLoaded", init);
