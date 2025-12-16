import { requireAdmin } from "../../lib/permission.js};

export default async (sock, m, body) => {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  if (!(await requireAdmin(sock, jid, sender))) return sock.sendMessage(jid, { text: "🌷 Fitur admin yaa~" });

  const desc = body.replace(".setdesc", "").trim();
  if (!desc) return sock.sendMessage(jid, { text: "🌷 Format: .setdesc Deskripsi" });
  await sock.groupUpdateDescription(jid, desc);
  await sock.sendMessage(jid, { text: "💗 Deskripsi grup diubah." });
};
