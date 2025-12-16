import { requireAdmin } from "../../lib/permission.js";

export default async (sock, m) => {
  const jid = m.key.remoteJid;
  const sender = m.key.participant || m.key.remoteJid;
  if (!(await requireAdmin(sock, jid, sender))) return sock.sendMessage(jid, { text: "🌷 Fitur admin yaa~" });

  const quoted = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
  if (!quoted) return sock.sendMessage(jid, { text: "🌷 Reply pesan bot lalu .delete" });
  await sock.sendMessage(jid, { delete: { remoteJid: jid, fromMe: true, id: quoted, participant: m.key.participant } });
};
