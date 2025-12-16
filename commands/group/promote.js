import { requireAdmin } from "../../lib/permission.js";

export default async (sock, m) => {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  if (!(await requireAdmin(sock, jid, sender))) return sock.sendMessage(jid, { text: "🌷 Fitur admin yaa~" });

  const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (!mentions.length) return sock.sendMessage(jid, { text: "🌷 Mention user: .promote @user" });
  await sock.groupParticipantsUpdate(jid, mentions, "promote");
  await sock.sendMessage(jid, { text: "💗 Dipromosikan admin." });
};
