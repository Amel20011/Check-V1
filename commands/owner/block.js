export default async (sock, m) => {
  const jid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  if (!jid) return sock.sendMessage(m.key.remoteJid, { text: "🌷 Mention user: .block @user" });
  await sock.updateBlockStatus(jid, "block");
  await sock.sendMessage(m.key.remoteJid, { text: "💗 Diblock." });
};
