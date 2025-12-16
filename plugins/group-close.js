export default async (sock, m) => {
  await sock.groupSettingUpdate(m.key.remoteJid, "announcement");
  await sock.sendMessage(m.key.remoteJid, { text: "🌹 Grup ditutup." });
};
