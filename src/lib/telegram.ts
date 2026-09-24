interface SendTelegramOptions {
  text: string;
}

export async function sendTelegramMessage({ text }: SendTelegramOptions): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID sozlanmagan — Telegram xabari yuborilmadi.");
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Telegram sendMessage xatosi:", res.status, body);
  }
}

export function buildLeadTelegramMessage(params: {
  name: string;
  phone: string;
  message?: string;
  purchaseLink: string;
}): string {
  const { name, phone, message, purchaseLink } = params;
  const lines = [
    "🌸 <b>Yangi lid — AromaLux</b>",
    "",
    `👤 Ism: <b>${escapeHtml(name)}</b>`,
    `📞 Tel: <b>${escapeHtml(phone)}</b>`,
  ];
  if (message) {
    lines.push(`💬 Izoh: ${escapeHtml(message)}`);
  }
  lines.push(
    "",
    "✅ Mijoz sotib olsa, quyidagi havolani bosib to'lovni kiriting — Metaga avtomatik Purchase yuboriladi:",
    purchaseLink
  );
  return lines.join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
