export default async (sock, m, body) => {
  const jid = m.key.remoteJid;
  const question = body.replace(".poll", "").trim() || "🌷 Polling";
  await sock.sendMessage(jid, { poll: { name: question, values: ["💗 Ya", "☘️ Tidak"] } });
};
