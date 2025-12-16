export default async (sock, m) => {
  await sock.groupSettingUpdate(m.key.remoteJid, "not_announcement");
  await sock.sendMessage(m.key.remoteJid, { text: "🌷 Grup dibuka." });
};
