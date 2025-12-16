import { requireAdmin } from "../../lib/permission.js";

export default async (sock, m) => {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  if (!(await requireAdmin(sock, jid, sender))) return sock.sendMessage(jid, { text: "🌷 Fitur admin yaa~" });

  await sock.groupRevokeInvite(jid);
  await sock.sendMessage(jid, { text: "🌹 Undangan direset." });
};
