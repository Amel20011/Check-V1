import { requireAdmin } from "../../lib/permission.js";
const antiLinkOn = new Map(); // jid -> boolean

export default async (sock, m, body) => {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  if (!(await requireAdmin(sock, jid, sender))) return sock.sendMessage(jid, { text: "🌷 Fitur admin yaa~" });

  const arg = body.split(" ")[1];
  if (arg === "on") { antiLinkOn.set(jid, true); await sock.sendMessage(jid, { text: "☘️ Anti-link ON 💗" }); }
  else if (arg === "off") { antiLinkOn.set(jid, false); await sock.sendMessage(jid, { text: "☘️ Anti-link OFF 💗" }); }
  else await sock.sendMessage(jid, { text: "🌷 Gunakan: .antilink on/off" });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const mm = messages[0];
    if (!mm?.message || mm.key.remoteJid !== jid) return;
    const text = mm.message?.conversation || mm.message?.extendedTextMessage?.text || "";
    if (antiLinkOn.get(jid) && /chat\.whatsapp\.com\/\S+/i.test(text)) {
      try { await sock.sendMessage(jid, { delete: mm.key }); } catch {}
    }
  });
};
