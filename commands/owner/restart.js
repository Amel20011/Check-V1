export default async (sock, m) => {
  await sock.sendMessage(m.key.remoteJid, { text: "🌹 Restarting…" });
  process.exit(0);
};
