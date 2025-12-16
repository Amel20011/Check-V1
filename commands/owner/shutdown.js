export default async (sock, m) => {
  await sock.sendMessage(m.key.remoteJid, { text: "🌷 Shutdown bot. Bye~" });
  process.exit(0);
};
