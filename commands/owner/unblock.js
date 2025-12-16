export default async (sock, m) => {
  const jid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!jid) return sock.sendMessage(m.key.remoteJid, { text: "🌷 Mention user: .unblock @user" });
  await sock.updateBlockStatus(jid, "unblock");
  await sock.sendMessage(m.key.remoteJid, { text: "💗 Unblock berhasil." });
};
