const recent = new Map();
export default async function antispam(sock, m) {
  const from = m.key.remoteJid;
  const now = Date.now();
  const last = recent.get(from) || 0;
  if (now - last < 800) {
    await sock.sendMessage(from, { text: "☘️ Slow down yaa~ 💗" });
  }
  recent.set(from, now);
}
