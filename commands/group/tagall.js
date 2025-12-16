import { requireAdmin } from "../../lib/permission.js";

export default async (sock, m) => {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  if (!(await requireAdmin(sock, jid, sender))) return sock.sendMessage(jid, { text: "🌷 Fitur admin yaa~" });

  const md = await sock.groupMetadata(jid);
  const mentions = md.participants.map(p => p.id);
  await sock.sendMessage(jid, { text: `🌷 Tagall:\n${mentions.map(x => `@${x.split("@")[0]}`).join(" ")}`, mentions });
};
