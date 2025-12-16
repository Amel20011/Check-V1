import { requireAdmin } from "../../lib/permission.js";

export default async (sock, m, body) => {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  if (!(await requireAdmin(sock, jid, sender))) return sock.sendMessage(jid, { text: "🌷 Fitur admin yaa~" });

  const num = (body.split(" ")[1] || "").replace(/\D/g, "");
  if (!num) return sock.sendMessage(jid, { text: "🌷 Format: .add 628xx" });
  await sock.groupParticipantsUpdate(jid, [num + "@s.whatsapp.net"], "add");
  await sock.sendMessage(jid, { text: `💗 Menambahkan ${num}` });
};
