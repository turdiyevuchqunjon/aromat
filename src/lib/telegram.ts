interface SendTelegramOptions {
  text: string;
}

/** Xabar muvaffaqiyatli yetkazilsa true qaytaradi. Hech qachon xato tashlamaydi. */
export async function sendTelegramMessage({ text }: SendTelegramOptions): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID sozlanmagan — Telegram xabari yuborilmadi.");
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Telegram sendMessage xatosi:", res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Telegram sendMessage so'rovi bajarilmadi:", err);
    return false;
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
    "✅ Mijoz sotib olsa, quyidagi havolani bosib to'lov summasini kiriting — Metaga avtomatik Purchase yuboriladi:",
    `<a href="${escapeHtml(purchaseLink)}">💰 Xaridni tasdiqlash</a>`
  );
  return lines.join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
