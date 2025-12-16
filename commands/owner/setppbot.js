export default async (sock, m) => {
  const jid = m.key.remoteJid;
  const img = m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
  if (!img) return sock.sendMessage(jid, { text: "🌷 Reply gambar lalu .setppbot" });
  const buffer = await sock.downloadMediaMessage({ message: { imageMessage: img } });
  await sock.updateProfilePicture("self", buffer);
  await sock.sendMessage(jid, { text: "💗 Foto bot diubah." });
};
