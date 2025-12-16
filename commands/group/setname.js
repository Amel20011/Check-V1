import { requireAdmin } from "../../lib/permission.js";

export default async (sock, m, body) => {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  if (!(await requireAdmin(sock, jid, sender))) return sock.sendMessage(jid, { text: "🌷 Fitur admin yaa~" });

  const name = body.replace(".setname", "").trim();
  if (!name) return sock.sendMessage(jid, { text: "🌷 Format: .setname Nama Baru" });
  await sock.groupUpdateSubject(jid, name);
  await sock.sendMessage(jid, { text: "💗 Nama grup diubah." });
};
